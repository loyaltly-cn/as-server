import type { Hono } from 'hono'
import { put } from '@vercel/blob'

export default (app: Hono) => {
    app.post('/', async (c) => {
        const form = await c.req.formData()
        const file = form.get('file') as File | null

        if (!file) {
            return c.json({ error: 'No file uploaded' }, 400)
        }

        try {
            // 使用 @vercel/blob 上传
            const blob = await put(file.name, file, {
                access: 'public', // 或者 'private'
            })

            return c.json({
                message: 'Upload success',
                url: blob.url,   // 可直接访问的 Blob URL
                pathname: blob.pathname
            })
        } catch (err) {
            return c.json({ error: 'Upload failed', detail: String(err) }, 500)
        }
    })
}
