import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your-secret-key'; // 建议使用环境变量存储
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
