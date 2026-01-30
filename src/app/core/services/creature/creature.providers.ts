// core/services/creature/creature.providers.ts

import { Provider } from '@angular/core';
import { CREATURE_REPOSITORY } from './creature-repository.interface';
import { JsonCreatureRepository } from './json-creature-repository.service';

/**
 * Providers for the creature subsystem.
 * Configures dependency injection to use JsonCreatureRepository as the default implementation.
 * This can be overridden in app configuration to use different implementations (API, database, etc.)
 */
export const CREATURE_PROVIDERS: Provider[] = [
  {
    provide: CREATURE_REPOSITORY,
    useClass: JsonCreatureRepository
  }
];

/**
 * Alternative: provide a factory function for more complex initialization
 */
export function provideCreatureRepository(): Provider {
  return {
    provide: CREATURE_REPOSITORY,
    useClass: JsonCreatureRepository
  };
}
