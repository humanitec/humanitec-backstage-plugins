import { ActiveResourceResponse, EnvironmentResponse } from '@humanitec/autogen';
import { fetchAppInfo, FetchAppInfoClient } from './fetch-app-info';

type envs = Awaited<ReturnType<FetchAppInfoClient["listEnvironments"]>>
type resources = Awaited<ReturnType<FetchAppInfoClient["listActiveResources"]>>
type runtime = Awaited<ReturnType<FetchAppInfoClient["getRuntime"]>>

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
      listEnvironments: jest.fn().mockResolvedValue(envs),
      listActiveResources: jest.fn().mockResolvedValue(resources),
      getRuntime: jest.fn().mockResolvedValue(runtime),
    };
  }

  const basicEnv = (): EnvironmentResponse => ({
    type: 'test',
    id: 'test',
    name: 'test',
    created_at: new Date(),
    created_by: 'test',
  })
  const deployedEnv = (): EnvironmentResponse => ({
    ...basicEnv(),
    last_deploy: {
      id: 'test',
      created_at: new Date(),
      status: 'succeeded' as 'succeeded',
      created_by: 'test',
      comment: 'test',
      env_id: 'test',
      export_file: 'test',
      from_id: 'test',
      export_status: 'test',
      set_id: 'test',
      status_changed_at: new Date(),
    },
  })
  const k8sClusterResource = (clusterType: string): ActiveResourceResponse => ({
    app_id: 'test',
    _class: 'test',
    def_id: 'test',
    def_version_id: 'test',
    deploy_id: 'test',
    driver_type: 'test',
    env_id: 'test',
    env_type: 'test',
    gu_res_id: 'test',
    org_id: 'test',
    res_id: 'k8s-cluster',
    resource: {
      cluster_type: clusterType,
    },
    secret_refs: {},
    status: 'active',
    type: 'test',
    updated_at: new Date(),
  })

  it('without environments', async () => {
    const client = createClientMock({envs: []})
    const res = await fetchAppInfo({ client }, 'orgId', 'appId')

    expect(res).toEqual([])

    expect(client.listEnvironments).toHaveBeenCalledWith({"appId": "appId", "orgId": "orgId"})
    expect(client.listActiveResources).not.toHaveBeenCalled()
    expect(client.getRuntime).not.toHaveBeenCalled()
  })


  it('without a deployment', async () => {
    const env = basicEnv()
    const client = createClientMock({envs: [env]})

    const res = await fetchAppInfo({ client }, 'orgId', 'appId')

     expect(res).toEqual([{
      ...env,
      usesGitCluster: false,
      runtime: null,
      resources: []
    }])

    expect(client.listEnvironments).toHaveBeenCalledWith({"appId": "appId", "orgId": "orgId"})
    expect(client.listActiveResources).not.toHaveBeenCalled()
    expect(client.getRuntime).not.toHaveBeenCalled()
  })

  it('with a git resource', async () => {
    const env = deployedEnv()
    const gitClusterResource = k8sClusterResource('git')
    const client = createClientMock({envs: [env], resources: [gitClusterResource]})

    const res = await fetchAppInfo({ client }, 'orgId', 'appId')

    expect(res).toEqual([{
      ...env,
      usesGitCluster: true,
      runtime: null,
      resources: [gitClusterResource]
    }])
    expect(client.listEnvironments).toHaveBeenCalledWith({"appId": "appId", "orgId": "orgId"})
    expect(client.listActiveResources).toHaveBeenCalledWith({"appId": "appId", "orgId": "orgId", "envId": "test"})
    expect(client.getRuntime).not.toHaveBeenCalled()
  })

  it('without a k8s-cluster git resource', async () => {
    const env = deployedEnv()
    const gkeClusterResource = k8sClusterResource('gke')
    const runtime = {
      namespace: 'test',
      modules: {}
    }
    const client = createClientMock({envs: [env], resources: [gkeClusterResource], runtime })

    const res = await fetchAppInfo({ client }, 'orgId', 'appId')

    expect(res).toEqual([{
      ...env,
      usesGitCluster: false,
      runtime,
      resources: [gkeClusterResource]
    }])
    expect(client.listEnvironments).toHaveBeenCalledWith({"appId": "appId", "orgId": "orgId"})
    expect(client.listActiveResources).toHaveBeenCalledWith({"appId": "appId", "orgId": "orgId", "envId": "test"})
    expect(client.getRuntime).toHaveBeenCalledWith({"appId": "appId", "orgId": "orgId", "envId": "test"})
  })
});
