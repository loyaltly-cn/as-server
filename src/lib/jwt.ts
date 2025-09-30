import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key' // 建议使用环境变量存储

export interface JWTPayload {
    userId: string
    [key: string]: any
}

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}