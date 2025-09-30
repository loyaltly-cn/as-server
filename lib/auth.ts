import type { Context, Next } from 'hono'

const whitelist = ['/auth/login/mp', '/register'] // 白名单路径

export async function authMiddleware(c: Context, next: Next) {
    const method = c.req.method
    const path = c.req.path
    const key = c.req.header('X-API-KEY')
    if (!key || (key !== process.env.X_API_KEY)) {
        return c.json({error:'key error'},400)
    }
    // 1. 放行 GET 请求
    if (method === 'GET') {
        return next()
    }
    // 2. 放行白名单请求
    if (whitelist.includes(path)) {
        return next()
    }

    // 3. 校验 token
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: Missing token' }, 401)
    }

    const token = authHeader.replace('Bearer ', '')

    // // TODO: 你可以在这里做 JWT 校验 / 数据库校验
    // if (token !== 'my-secret-token') {
    //     return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    // }

    return next()
}
