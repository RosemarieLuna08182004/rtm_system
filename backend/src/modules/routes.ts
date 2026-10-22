import { Express, RequestHandler } from "express";

export const defineRoutes = (controllers: any, application: Express) => {
  for (let i = 0; i < controllers.length; i++) {
    // Grab the controller *class* first so we can inspect its metadata,
    // then instantiate it for use as the route handler context.
    const ControllerClass = controllers[i];
    const controllerInstance = new ControllerClass();

    const routeHandlers: Map<
      keyof Express,
      Map<string, RequestHandler[]>
    > = Reflect.getMetadata("routeHandlers", ControllerClass.prototype) as Map<keyof Express, Map<string, RequestHandler[]>>;

    const controllerPath: string = Reflect.getMetadata(
      "baseRoute",
      ControllerClass,
    );
    const methods = Array.from(routeHandlers.keys());

    logging.log("----------------------------------------");
    for (let j = 0; j < methods.length; j++) {
      const method = methods[j];
      const routes = routeHandlers.get(method as keyof Express);

      if (routes) {
        const routeNames = Array.from(routes.keys());
        for (let k = 0; k < routeNames.length; k++) {
          const handlers = routes.get(routeNames[k]);

          if (handlers) {
            console.log(`[DEBUG] Registering route:`, {
              controller: ControllerClass.name,
              method,
              path: controllerPath + routeNames[k]
            });
            // Bind each handler to the controller instance so that `this` works
            const boundHandlers = handlers.map((h) => h.bind(controllerInstance));
            application[method as keyof Express](
              controllerPath + routeNames[k],
              boundHandlers,
            );
            logging.log(
              "Loading route:",
              method,
              controllerPath + routeNames[k],
            );
          }
        }
      }
    }
    logging.log("----------------------------------------");
  }
};
