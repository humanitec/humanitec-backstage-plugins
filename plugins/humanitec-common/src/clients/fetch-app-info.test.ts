import { fetchAppInfo, FetchAppInfoClient } from './fetch-app-info';

type envs = Awaited<ReturnType<FetchAppInfoClient["getEnvironments"]>>
type resources = Awaited<ReturnType<FetchAppInfoClient["getActiveEnvironmentResources"]>>
type runtime = Awaited<ReturnType<FetchAppInfoClient["getRuntimeInfo"]>>

describe('fetchAppInfo', () => {
  const createClientMock = ({
    envs,
    resources,
    runtime
  }: {
    envs: envs,
    resources?: resources,
    runtime?: runtime
  }) => {
    return {
      getEnvironments: jest.fn().mockResolvedValue(envs),
      getActiveEnvironmentResources: jest.fn().mockResolvedValue(resources),
      getRuntimeInfo: jest.fn().mockResolvedValue(runtime),
    };
  }

  const deployedEnv = () => ({
    type: 'test',
    id: 'test',
    name: 'test',
    last_deploy: {
      id: 'test',
      created_at: 'test',
      status: 'succeeded' as 'succeeded',
      created_by: 'test',
      comment: 'test',
      env_id: 'test',
      export_file: 'test',
      from_id: 'test',
      export_status: 'test',
      set_id: 'test',
      status_changed_at: 'test',
    }
  })
  const k8sClusterResource = (clusterType: string) => ({
    app_id: 'test',
    def_id: 'test',
    env_id: 'test',
    env_type: 'test',
    org_id: 'test',
    res_id: 'k8s-cluster',
    resource: {
      cluster_type: clusterType,
    },
    status: 'active' as 'active',
    type: 'test',
    updated_at: 'test',
  })

  it('without environments', async () => {
    const client = createClientMock({envs: []})
    const res = await fetchAppInfo({ client }, 'appId')

    expect(res).toEqual([])

    expect(client.getEnvironments).toHaveBeenCalledWith('appId')
    expect(client.getActiveEnvironmentResources).not.toHaveBeenCalled()
    expect(client.getRuntimeInfo).not.toHaveBeenCalled()
  })


  it('without a deployment', async () => {
    const env = {
      type: 'test',
      id: 'test',
      name: 'test',
    }
    const client = createClientMock({envs: [env]})

    const res = await fetchAppInfo({ client }, 'appId')

     expect(res).toEqual([{
      ...env,
      usesGitCluster: false,
      runtime: null,
      resources: []
    }])

    expect(client.getEnvironments).toHaveBeenCalledWith('appId')
    expect(client.getActiveEnvironmentResources).not.toHaveBeenCalled()
    expect(client.getRuntimeInfo).not.toHaveBeenCalled()
  })

  it('with a git resource', async () => {
    const env = deployedEnv()
    const gitClusterResource = k8sClusterResource('git')
    const client = createClientMock({envs: [env], resources: [gitClusterResource]})

    const res = await fetchAppInfo({ client }, 'appId')

    expect(res).toEqual([{
      ...env,
      usesGitCluster: true,
      runtime: null,
      resources: [gitClusterResource]
    }])
    expect(client.getEnvironments).toHaveBeenCalledWith('appId')
    expect(client.getActiveEnvironmentResources).toHaveBeenCalledWith('appId', 'test')
    expect(client.getRuntimeInfo).not.toHaveBeenCalled()
  })

  it('without a k8s-cluster git resource', async () => {
    const env = deployedEnv()
    const gkeClusterResource = k8sClusterResource('gke')
    const runtime = {
      namespace: 'test',
      modules: {}
    }
    const client = createClientMock({envs: [env], resources: [gkeClusterResource], runtime })

    const res = await fetchAppInfo({ client }, 'appId')

    expect(res).toEqual([{
      ...env,
      usesGitCluster: false,
      runtime,
      resources: [gkeClusterResource]
    }])
    expect(client.getEnvironments).toHaveBeenCalledWith('appId')
    expect(client.getActiveEnvironmentResources).toHaveBeenCalledWith('appId', 'test')
    expect(client.getRuntimeInfo).toHaveBeenCalledWith('appId', 'test')
  })
});
