import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import {
  ValidateHumanitecAppID,
  validateHumanitecAppIDValidation,
} from './ValidateHumanitecAppIDExtension';

export const ValidateHumanitecAppIDFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'ValidateHumanitecAppID',
    component: ValidateHumanitecAppID,
    validation: validateHumanitecAppIDValidation,
  }),
);
