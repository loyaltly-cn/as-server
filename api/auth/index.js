import { PrismaClient } from '@prisma/client';
import wx from '../../lib/wx';
import { generateToken } from '../../lib/jwt';
export default (app) => {
    app.post('login/mp', async (c) => {
        const { code } = await c.req.json();
        const res = await wx.getOpenid(code);
        const openid = res.data.openid;
        if (!openid)
            return c.json({ message: res.data.errmsg });
        const prisma = new PrismaClient();
        let user = await prisma.user.findUnique({
            where: { openid }
        });
        if (!user)
            user = await prisma.user.create({
                data: {
                    openid: openid,
                }
            });
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 30);
        return c.json({
            token: generateToken({
                userId: user.id,
                ts: currentDate.getTime()
            }),
            info: user
        });
    });
};
