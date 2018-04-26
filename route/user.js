const express = require('express');
const log4js = require('log4js');
const app = express();
let request = require('request');
let j = request.jar();

const config = require('../config/global');
const log4j = require('../config/log4j');

log4js.configure(log4j);
const logger = log4js.getLogger('user');

/**
 * 登陆验证
 */
app.post('/login', (req, res) => {
    logger.info(__filename, "登录参数：", req.body, req.method);
    request.post({url: config.API_BASE_URL + '/login', form: req.body}, (err, resp, body) => {
        if (err) {
            res.send(500);
            return;
        }
        res.cookie(resp.headers['set-cookie'][0], {maxAge: 60 * 1000 * 60 * 24, httpOnly: true});
        const respJson = JSON.parse(body);
        logger.info('当前登录用户信息：Cookie:', resp.headers['set-cookie'][0], 'name:', respJson.data.realname);
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
 * 获取cookie中间件
 */
app.use((req, res, next) => {
    logger.info('cookie:', 'sid=' + req.cookies.sid, 'user:', req.session.user.realname);
    const cookie = request.cookie('sid=' + req.cookies.sid);
    j.setCookie(cookie, config.API_BASE_URL);
    request = request.defaults({jar: j});
    next();
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
    request.post({url: config.API_BASE_URL + '/logout'});
    req.session.destroy();
    res.redirect("/");
});

module.exports = app;