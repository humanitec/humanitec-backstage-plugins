import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

interface EnvironmentAction {
  orgId: string
  cloudProvider?: string
  githubOrgId?: string
}

export function createGetEnvironmentAction({ orgId, cloudProvider, githubOrgId }: EnvironmentAction) {
  return createTemplateAction({
    id: 'humanitec:get-environment',
    description: 'Retrieves Humanitec environment configuration',
    schema: {
      output: {
        orgId: z => z.string().describe('The Humanitec organization ID'),
        cloudProvider: z => z.string().optional().describe('The cloud provider'),
        githubOrgId: z => z.string().optional().describe('The GitHub organization ID'),
        githubOIDCCustomization: z => z.object({
          useDefault: z.boolean(),
          includeClaimKeys: z.array(z.string()),
        }).optional().describe('GitHub OIDC customization settings'),
      },
    },
    handler: async (ctx) => {
      ctx.output('orgId', orgId);
      ctx.output('cloudProvider', cloudProvider);
      ctx.output('githubOrgId', githubOrgId);

      let githubOIDCCustomization;
      if (cloudProvider === 'azure') {
        githubOIDCCustomization = {
          useDefault: false,
          includeClaimKeys: ["repository_owner"]
        };
      }
      ctx.output('githubOIDCCustomization', githubOIDCCustomization);
    },
  });
}
