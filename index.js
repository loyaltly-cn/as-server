import { Hono } from "hono";
import { loadRoutes } from "./lib/router";
import path from "path";
const app = new Hono();
const apiDir = path.join(process.cwd(), "api");
loadRoutes(app, apiDir);
export default app;
