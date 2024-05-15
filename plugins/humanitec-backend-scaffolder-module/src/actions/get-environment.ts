import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

interface EnvironmentAction {
  orgId: string
  cloudProvider?: string
  githubOrgId?: string
}

export function createGetEnvironmentAction({ orgId, cloudProvider, githubOrgId }: EnvironmentAction) {
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
          githubOrgId: {
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
      ctx.output('githubOrgId', githubOrgId);

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
