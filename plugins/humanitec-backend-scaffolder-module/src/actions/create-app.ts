import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { stat, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { loadAll } from 'js-yaml';
import { createHumanitecClient } from '@humanitec/backstage-plugin-common';
import { object, string, array } from 'zod';

const SetupDocument = object({
  id: string(),
  name: string()
});

export const SetupFileSchema = array(SetupDocument);

interface HumanitecCreateApp {
  orgId: string;
  token: string;
}

export function createHumanitecApp({ token, orgId }: HumanitecCreateApp) {
  return createTemplateAction({
    id: 'humanitec:create-app',
    description: 'Creates a Humanitec application from a setup file',
    schema: {
      input: {
        appId: z => z.string().describe('The application ID'),
        setupFile: z => z.string().optional().describe('Path to the setup YAML file'),
      },
    },
    async handler(ctx) {
      const { input, workspacePath, logger } = ctx;
      const client = createHumanitecClient({ token });

      const setupFile = input.setupFile ?? 'humanitec-apps.yaml';
      const setupFilePath = resolve(join(workspacePath, setupFile));

      let setupFileContent: unknown[] | null;
      try {
        setupFileContent = await loadSetupFile(setupFilePath);
        logger.info("Successfully loaded contents of setup file.");
      } catch (e) {
        logger.error(String(e));
        return;
      }

      const apps = SetupFileSchema.parse(setupFileContent);

      for (const app of apps) {
        try {
          await client.createApplication({
            orgId,
            ApplicationCreationRequest: { id: app.id, name: app.name }
          });
          logger.info(`Created ${app.name} with ${app.id}`)
        } catch (e) {
          logger.error(`Failed to create app ${app.id} with name ${app.name}`)
          logger.debug(String(e));
          continue;
        }
      }
    },
  });
}

async function loadSetupFile(filePath: string) {
  const file = await stat(filePath);
  if (file.isFile()) {
    try {
      const content = await readFile(filePath);
      const documents = loadAll(`${content}`);
      return documents;
    } catch (e) {
      throw new Error(`Could not parse YAML from ${filePath}`);
    }
  }
  return null;
}
