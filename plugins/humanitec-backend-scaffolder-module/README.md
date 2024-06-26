# @humanitec/backstage-plugin-scaffolder-backend-module

`@humanitec/backstage-plugin-scaffolder-backend-module` is a new backend system module to add the humanitec action in the scaffolder

## Scaffolder Actions

This plugin provides the following scaffolder actions:

### create-app

`create-app` will create an app in Humanitec with specific workloads and automation.

#### Installation

1. Install `@humanitec/backstage-plugin-scaffolder-backend-module` plugin with,

```bash
yarn workspace backend add @humanitec/backstage-plugin-scaffolder-backend-module
```

1. Add the plugin in `./packages/backend/src/index.ts` to your backend,

```diff
+ backend.add(import('@humanitec/backstage-plugin-scaffolder-backend-module'));

backend.start();
```

1. Add configuration to `app-config.yaml`

```diff
humanitec:
  orgId: the-frontside-software-inc
  token: ${HUMANITEC_TOKEN}
```

### Usage

Add the action to your template,

```diff
+    - name: Create Humanitec App
+      id: humanitec-create-app
+      action: humanitec:create-app
+      input:
+        setupFile: humanitec-apps.yaml
+        appId: ${{ parameters.componentName }}

+    - name: Fetch configured humanitec.orgId
+      id: humanitec-environment
+      action: humanitec:get-environment
```

### setupFile parameter

`humanitec:create-app` needs to know what workloads to create in the Humanitec App. In the future, workload configuration will be handled using [paws.sh](https://paws.sh), in the mean time, `humanitec:create-app` expects to read an YAML file where it expects to find information about the payload. By default, this file is called `humanitec-app.yaml` and can be changed by specifying `setupFile` parameter.

Here is an example of such a file,

```yaml
---
id: ${{values.componentName | dump}}
name: ${{values.componentName | dump}}

environments:
  development:
    metadata:
      env_id: development
      name: Initial deployment

    modules:
      ${{values.componentName | dump}}:
        externals:
          http:
            type: dns
        profile: humanitec/default-module
        spec:
          containers:
            ${{values.componentName | dump}}:
              id: ${{values.componentName}}
              image: ${{values.registryUrl}}/${{values.componentName}}:dummy
              resources:
                limits:
                  cpu: 0.25
                  memory: 256Mi
                requests:
                  cpu: 0.025
                  memory: 64Mi
              variables: {}
              volume_mounts: {}
              files: {}
          ingress:
            rules:
              externals.http:
                http:
                  "/":
                    port: 9898
                    type: prefix

# automations that will be created
# see https://api-docs.humanitec.com/#tag/AutomationRule/paths/~1orgs~1{orgId}~1apps~1{appId}~1envs~1{envId}~1rules/post
automations:
  development:
    - active: true
      exclude_images_filter: false
      images_filter: []
      type: update
      update_to: branch
```
