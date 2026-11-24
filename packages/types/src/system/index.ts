import {StatusController} from './StatusController';
import {MigrationController} from './MigrationController';
import {SupportController} from './SupportController';
import {ReportController} from './ReportController';
import {NotificationController} from './NotificationController';

export const system = {MigrationController, StatusController, SupportController, ReportController, NotificationController};

export * from './StatusController';
export * from './SupportController';
export * from './MigrationController';
export * from './ReportController';
export * from './NotificationController';
