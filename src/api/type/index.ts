import { Hono } from "hono"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default (app: Hono) =>{
    app.post("/", async (c) => {
        try {
            const body = await c.req.json<{ name: string }>()
            const type = await prisma.type.create({
                data: { name: body.name },
            })
            return c.json({ success: true, data: type })
        } catch (e: any) {
            return c.json({ success: false, error: e.message }, 400)
        }
    })

// 查询所有 Type
    app.get("/", async (c) => {
        const types = await prisma.type.findMany({
            orderBy: { createAt: "desc" },
        })
        return c.json({ success: true, data: types })
    })


    app.put("/", async (c) => {
        try {
            const body = await c.req.json<{ id: string; name: string }>()
            const type = await prisma.type.update({
                where: { id: body.id },
                data: { name: body.name },
            })
            return c.json({ success: true, data: type })
        } catch (e: any) {
            return c.json({ success: false, error: e.message }, 400)
        }
    })

// 删除 Type
    app.delete("/", async (c) => {
        try {
            const body = await c.req.json<{ id: string }>()
            await prisma.type.delete({ where: { id: body.id } })
            return c.json({ success: true, message: "Deleted successfully" })
        } catch (e: any) {
            return c.json({ success: false, error: e.message }, 400)
        }
    })

}
