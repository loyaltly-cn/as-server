import { Hono } from "hono"
import { loadRoutes } from "./lib/router"
import path from "path"

const app = new Hono()

// 异步加载所有路由
const apiDir = path.join(process.cwd(), "api")
await loadRoutes(app, apiDir)

export default app
