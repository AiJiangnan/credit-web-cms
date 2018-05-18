const express = require('express');
const log4js = require('log4js');
const app = express();
const request = require('request');

const config = require('../config/global');
const log4j = require('../config/log4j');

log4js.configure(log4j);
const logger = log4js.getLogger('middle');

/**
 * user接口中间件
 * 前端ajax的请求直接访问后端的接口
 */
app.route('/*')
    .all((req, res, next) => {
        logger.info(req.originalUrl, req.method);
        next();
    })
    .get((req, res) => {
        request.get({url: config.API_BASE_URL + req.originalUrl, headers: {Cookie: req.session.sid}}, (err, resp, body) => {
            if (err) {
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
    })
    .post((req, res) => {
        logger.info("请求参数：", JSON.stringify(req.body));
        request.post({url: config.API_BASE_URL + req.path, form: req.body, headers: {Cookie: req.session.sid}}, (err, resp, body) => {
            if (err) {
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