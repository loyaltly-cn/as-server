import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default (app) => {
    //     app.post("/", async (c) => {
    //         try {
    //             const body = await c.req.json()
    //             const genre = await prisma.genre.create({
    //                 data: body,
    //             })
    //             return c.json({ success: true, data: genre })
    //         } catch (e: any) {
    //             return c.json({ success: false, error: e.message }, 400)
    //         }
    //     })
    //
    // // 查询所有 Type
    //     app.get("/", async (c) => {
    //         const genre = await prisma.genre.findMany({
    //             orderBy: { createAt: "desc" },
    //         })
    //         return c.json({ success: true, data: genre })
    //     })
    //
    //
    //     app.put("/", async (c) => {
    //         try {
    //             const body = await c.req.json<{ id: string; name: string }>()
    //             const genre = await prisma.genre.update({
    //                 where: { id: body.id },
    //                 data: { name: body.name },
    //             })
    //             return c.json({ success: true, data: genre })
    //         } catch (e: any) {
    //             return c.json({ success: false, error: e.message }, 400)
    //         }
    //     })
    //
    // // 删除 Type
    //     app.delete("/", async (c) => {
    //         try {
    //             const body = await c.req.json<{ id: string }>()
    //             await prisma.genre.delete({ where: { id: body.id } })
    //             return c.json({ success: true, message: "Deleted successfully" })
    //         } catch (e: any) {
    //             return c.json({ success: false, error: e.message }, 400)
    //         }
    //     })
    app.get("/", (c) => c.text("Hello /test"));
};
