import { HumanitecClient } from './humanitec';

const k8sResID = 'k8s-cluster';
const gitClusterType = 'git';

export type FetchAppInfoClient = Pick<HumanitecClient, 'listEnvironments' | 'listActiveResources'| 'getRuntime'>;

export async function fetchAppInfo({ client }: { client: FetchAppInfoClient; }, orgId: string, appId: string) {
  const environments = await client.listEnvironments({
    orgId,
    appId,
  })

  return await Promise.all(environments.map(async (env) => {
    let usesGitCluster = false
    if (!env.last_deploy) {
      return {
        ...env,
        usesGitCluster,
        runtime: null,
        resources: []
      };
    }

    const resources = await client.listActiveResources({
      orgId,
      appId,
      envId: env.id,
    });

    // k8s-cluster of cluster_type git have no runtime information
    for (const resource of resources) {
      if (resource.res_id === k8sResID && resource.resource?.cluster_type === gitClusterType) {
        usesGitCluster = true;

        return {
          ...env,
          usesGitCluster,
          runtime: null,
          resources
        };
      }
    }

    const runtime = await client.getRuntime({
      orgId,
      appId,
      envId: env.id,
    })

    return {
      ...env,
      usesGitCluster,
      runtime,
      resources
    };
  }));
}

export type FetchAppInfoResponse = Awaited<ReturnType<typeof fetchAppInfo>>
export type FetchAppInfoEnvironment = FetchAppInfoResponse[0]
