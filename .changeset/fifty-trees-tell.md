---
'@humanitec/backstage-plugin-scaffolder-backend-module': minor
'@humanitec/backstage-plugin-backend': minor
'@humanitec/backstage-plugin-common': minor
'@humanitec/backstage-plugin': minor
---

Migrate to Backstage 1.45.3

- Replace deprecated `@backstage/backend-common` with `@backstage/backend-defaults`
- Update logger from Winston to native Backstage `LoggerService`
- Replace deprecated `errorHandler()` with `MiddlewareFactory`
- Remove unused standalone development files (run.ts, standaloneServer.ts)
