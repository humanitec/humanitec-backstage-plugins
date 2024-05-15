import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

interface EnvironmentAction {
  orgId: string
  cloudProvider?: string
}

export function createGetEnvironmentAction({ orgId, cloudProvider }: EnvironmentAction) {
  return createTemplateAction({
    id: 'humanitec:get-environment',
    schema: {
      output: {
        required: [
          'orgId',
        ],
        properties: {
          orgId: {
            type: 'string'
          },
          cloudProvider: {
            type: 'string'
          },
          githubOIDCCustomization: {
            type: 'object'
          }
        }
      }
    },
    handler: async (ctx) => {
      ctx.output('orgId', orgId);
      ctx.output('cloudProvider', cloudProvider);

      let githubOIDCCustomization
      if (cloudProvider === 'azure') {
        githubOIDCCustomization = {
          "useDefault": false,
          "includeClaimKeys": ["repository_owner"]
        }
      }
      ctx.output('githubOIDCCustomization', githubOIDCCustomization);
    },
  });
}
