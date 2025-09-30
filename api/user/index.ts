import type {Hono} from "hono";

export default (app: Hono) => {
    app.get("/", async (c) => c.json({ message: 'test' }))
}
