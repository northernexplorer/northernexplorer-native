import {Express} from 'express';
import {ROUTES} from '@northernexplorer/types';
import {controllers} from './controllers';
import {handle} from './handle';
import {strictAuthLimiter, STRICT_ROUTES} from './rateLimiters';

export function registerRoutes(app: Express) {
	Object.entries(ROUTES).forEach(([, controllersObj]) => {
		Object.entries(controllersObj).forEach(([controllerName, methods]) => {
			const ControllerClass = controllers.find(c => c.name === controllerName);

			if (ControllerClass) {
				Object.entries(methods).forEach(([methodName]) => {
					const path = `/api/${ControllerClass.name}/${methodName}`;
					console.log(`Registering: ${path}`);
					const strictMethods = STRICT_ROUTES[ControllerClass.name];

					if (strictMethods?.includes(methodName)) {
						app.all(path, strictAuthLimiter, handle(ControllerClass, methodName as keyof InstanceType<typeof ControllerClass> & string));
					} else {
						app.all(path, handle(ControllerClass, methodName as keyof InstanceType<typeof ControllerClass> & string));
					}
				});
			}
		});
	});
}
