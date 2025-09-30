import axios from "axios";
const appid = process.env.MP_WEIXIN_APP_ID;
const secret = process.env.MP_WEIXIN_SECRET;
const baseUrl = 'https://api.weixin.qq.com/';
const getToken = async () => {
    const res = await axios.get(`${baseUrl}cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`);
    return res.data.access_token;
};
const getOpenid = async (code) => await axios.get(`${baseUrl}sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`);
const getPhoneNumber = async (code) => await axios.post(`${baseUrl}wxa/business/getuserphonenumber?access_token=${await getToken()}`, { code });
export default {
    getOpenid,
    getPhoneNumber,
};
