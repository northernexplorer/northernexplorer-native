import {StatusController} from './StatusController';
import {MigrationController} from './MigrationController';
import {SupportController} from './SupportController';

export const system = {MigrationController, StatusController, SupportController};

export * from './StatusController';
export * from './SupportController';
export * from './MigrationController';
