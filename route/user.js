const express = require('express');
const log4js = require('log4js');
const app = express();
let request = require('request');
request = request.defaults({jar: true});

const config = require('../config/global');
const log4j = require('../config/log4j');

log4js.configure(log4j);
const logger = log4js.getLogger('user');

/**
 * 登陆验证
 */
app.post('/login', (req, res) => {
    logger.info(__filename, "登录参数：", req.body, req.method);
    request.post({
        url: config.API_BASE_URL + '/login',
        form: req.body
    }, (err, resp, body) => {
        if (err) {
            res.send(500);
            return;
        }
        const respJson = JSON.parse(body);
        logger.info(__filename, "登录响应：", body);
        if (respJson.code === 0) {
            req.session.user = respJson.data;
            res.send(resp.statusCode, respJson.code);
        } else {
            req.session.destroy();
            res.send(resp.statusCode, respJson.msg);
        }
    });
});

/**
 * 获取当前登陆管理员信息
 */
app.get('/show', (req, res) => {
    const user = req.session.user;
    res.send(200, user.realname);
});

/**
 * 退出
 */
app.get('/exit', (req, res) => {
    request.post({url: config.API_BASE_URL + '/logout'}, (err, resp, body) => {
        if (err) {
            res.send(500);
            return;
        }
        if (!resp.statusCode === 200) res.send(resp.statusCode);
    });
    req.session.destroy();
    res.redirect("/");
});

/**
 * user接口中间件
 * 前端ajax的请求直接访问后端的接口
 */
app.route('/*')
    .all((req, res, next) => {
        logger.info(__filename, req.originalUrl, req.method);
        next();
    })
    .get((req, res) => {
        try {
            request.get({url: config.API_BASE_URL + req.originalUrl}, (err, resp, body) => {
                if (err) {
                    res.send(500);
                    return;
                }
                logger.info(__filename, "响应参数：", body);
                res.send(resp.statusCode, JSON.parse(body));
            });
        } catch (e) {
            logger.error(e);
            res.send(500, '服务器错误！');
        }
    })
    .post((req, res) => {
        logger.info(__filename, "请求参数：", JSON.stringify(req.body));
        try {
            request.post({url: config.API_BASE_URL + req.path, form: req.body}, (err, resp, body) => {
                if (err) {
                    res.send(500);
                    return;
                }
                logger.info(__filename, "响应参数：", body);
                res.send(resp.statusCode, JSON.parse(body));
            });
        } catch (e) {
            logger.error(e);
            res.send(500, '服务器错误！');
        }
    });

module.exports = app;