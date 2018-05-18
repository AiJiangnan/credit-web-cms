const express = require('express');
const log4js = require('log4js');
const app = express();
const request = require('request');

const config = require('../config/global');
const log4j = require('../config/log4j');

log4js.configure(log4j);
const logger = log4js.getLogger('user');

/**
 * 登陆验证
 */
app.post('/login', (req, res) => {
    logger.info("登录参数：", req.body, req.method);
    request.post({url: config.API_BASE_URL + '/login', form: req.body}, (err, resp, body) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        const respJson = JSON.parse(body);
        if (respJson.code === 0) {
            req.session.user = respJson.data;
            req.session.sid = resp.headers['set-cookie'][0].split(';')[0];
            logger.info('当前登录人：', req.session.user.realname, 'sid:', req.session.sid);
            res.status(resp.statusCode).send({code: respJson.code});
        } else {
            req.session.destroy();
            res.status(resp.statusCode).send(respJson.msg);
        }
    });
});

/**
 * 获取当前登陆管理员信息
 */
app.get('/show', (req, res) => {
    const user = req.session.user;
    res.status(200).send(user.realname);
});

/**
 * 退出
 */
app.get('/exit', (req, res) => {
    request.post({url: config.API_BASE_URL + '/logout', headers: {Cookie: req.session.sid}});
    req.session.destroy();
    res.redirect("/");
});

module.exports = app;