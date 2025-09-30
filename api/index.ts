import { Hono } from "hono"
import path from "path"
import "dotenv/config"
import { authMiddleware } from "../lib/auth"
import { loadRoutes } from "../lib/router"

const app = new Hono()

// 全局中间件
app.use("*", authMiddleware)

// 自动加载 routes
loadRoutes(app, path.join(import.meta.dir))

// Bun server`
import { serve } from "bun"
serve({
    fetch: app.fetch,
    port: 3000,
})

console.log("🚀 Server running on http://localhost:3000")
