import logger from "morgan";

import cookieParser from "cookie-parser";

import express from "express";
import axios from "axios";
import path from 'path';
import {fileURLToPath} from 'url';

// 获取当前模块的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.raw({type: '*/*', limit: '10mb'}))
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

function crc32(buffer) {
    let crc = 0xffffffff;

    for (let i = 0; i < buffer.length; i++) {
        crc ^= buffer[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
        }
    }

    return (crc ^ 0xffffffff) >>> 0; // 返回无符号整数
}


app.put('/', async (req, res) => {
    // req.body 是 Buffer 类型
    const requestBody = req.body;
    const response = await axios.post(
        'https://picupload.weibo.com/interface/upload.php',
        requestBody,
        {
            params: {
                'cs': crc32(requestBody),
                'ent': 'miniblog'
            },
            headers: {
                'cookie': '登录weibo.com后的cookie',
                'Content-Type': 'image/gif'
            }
        }
    );

    const data = response.data;

    const pid = data?.pic?.pid

    if (!pid) {
        return res.status(403).send('上传微博失败了')
    }
    const url = `https://wx3.sinaimg.cn/large/${pid}`

    console.log(`上传成功 ${url}`)
    // 返回响应
    res.send(url);
});

// 处理 GET 请求
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'image.gif'); // 替换为你的文件路径
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('File send error:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent:', filePath);
        }
    });
});


app.listen(5001, () => {
    console.log("server is running on port 5001")
})
