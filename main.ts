import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { createRouter } from "./src/main.router.ts";
import { errorHandler } from "./src/middlewares/error-handler.ts";

const app = new Application();

const { routes, allowedMethods, port } = createRouter();

app.use(errorHandler);
app.use(routes);
app.use(allowedMethods);

console.log("Listening at http://localhost:" + port);
await app.listen({ port: port });
