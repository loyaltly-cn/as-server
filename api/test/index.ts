import type { Hono } from "hono"

export default (app: Hono) => {
    app.get("/", (c) => c.text("Hello /test"))
    app.get("/custom", (c) => c.json({ message: "Hello custom route" }))
    app.post("/", async (c) => {
        const body = await c.req.json<{ name: string }>() // 可以指定请求体类型
        return c.json({ message: "Post ok", name: body.name })
    })
}
