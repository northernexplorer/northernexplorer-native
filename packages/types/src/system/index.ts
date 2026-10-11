import {StatusController} from './StatusController';
import {MigrationController} from './MigrationController';
import {SupportController} from './SupportController';
import {ReportController} from './ReportController';

export const system = {MigrationController, StatusController, SupportController, ReportController};

export * from './StatusController';
export * from './SupportController';
export * from './MigrationController';
export * from './ReportController';
