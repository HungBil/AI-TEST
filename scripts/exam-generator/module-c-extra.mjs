import { dataFactories } from './module-c-extra-data.mjs';
import { ragFactories } from './module-c-extra-rag.mjs';
import { monitoringFactories } from './module-c-extra-monitoring.mjs';

export const extraCFactories = {
  ...dataFactories,
  ...ragFactories,
  ...monitoringFactories
};
