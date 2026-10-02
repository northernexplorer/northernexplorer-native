import {Express} from 'express';
import {ROUTES} from '@northernexplorer/types';
import {controllers, ControllerConstructor} from './controllers';
import {handle} from './handle';
import {strictAuthLimiter, STRICT_ROUTES} from './rateLimiters';
import {BaseController} from './BaseController';

export function registerRoutes(app: Express) {
	Object.entries(ROUTES).forEach(([, controllersObj]) => {
		Object.entries(controllersObj).forEach(([controllerName, methods]) => {
			const ControllerClass: ControllerConstructor | undefined = controllers.find(c => c.name === controllerName);

			if (ControllerClass) {
				Object.entries(methods).forEach(([methodName]) => {
					const path = `/api/${ControllerClass.name}/${methodName}`;
					console.log(`Registering: ${path}`);
					const strictMethods = STRICT_ROUTES[ControllerClass.name];

					const methodKey = methodName as keyof BaseController & string;

					if (strictMethods?.includes(methodName)) {
						app.all(path, strictAuthLimiter, handle(ControllerClass, methodKey));
					} else {
						app.all(path, handle(ControllerClass, methodKey));
					}
				});
			}
		});
	});
}
