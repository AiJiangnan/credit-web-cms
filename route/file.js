const express = require('express');
const log4js = require('log4js');
const app = express();
const request = require('request');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
const upload = multer({storage: storage});

const config = require('../config/global');
const log4j = require('../config/log4j');

log4js.configure(log4j);
const logger = log4js.getLogger('file');

/**
 * 文件上传和下载
 * 前端ajax的请求直接访问后端的接口
 */
app.get(/export/, (req, res) => {
    logger.info(req.originalUrl, req.method);
    try {
        request({url: config.API_BASE_URL + req.originalUrl, headers: {Cookie: req.session.sid}}).pipe(res);
    } catch (e) {
        logger.error(e);
        res.status(500).send('服务器错误！');
    }
});

app.post(/upload/, upload.single('file'), (req, res) => {
    logger.info(req.originalUrl, req.method);
    let file = fs.createReadStream(__dirname + '//file.js');
    console.log(req.file);
    request.post({url: config.API_BASE_URL + req.originalUrl, headers: {Cookie: req.session.sid}, formData: {file: file}}, (err, resp, body) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        try {
            if (body) {
                const json = JSON.parse(body);
                logger.info("响应结果：", json.msg);
                res.status(resp.statusCode).send(json);
            } else {
                logger.error('响应结果为空！', req.path);
                res.sendStatus(resp.statusCode);
            }
        } catch (e) {
            logger.error(e);
            res.status(500).send('服务器错误！');
        }
    });
});

module.exports = app;