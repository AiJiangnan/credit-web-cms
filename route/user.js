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
    request.post({
        url: config.API_BASE_URL + '/user/login',
        form: req.body
    }, (err, resp, body) => {
        if (err) {
            res.send(500);
            return;
        }
        let respJson = JSON.parse(body);
        if (respJson.code === 1) {
            req.session.user = respJson.data;
            res.send(resp.statusCode, respJson.code);
        } else {
            req.session.destroy();
            res.send(resp.statusCode, "用户名或密码错误！");
        }
    });
});

/**
 * 修改个人资料
 */
app.post('/toEdit', (req, res) => {
    let [user, loginUser] = [req.body, req.session.user];
    if (user.password !== '' && user.password !== loginUser.password) {
        res.send("100");
    } else {
        request.post({url: config.API_BASE_URL + '/user/edit', form: user}, (err, resp, body) => {
            if (!err && resp.statusCode === 200) {
                let respJson = JSON.parse(body);
                if (respJson.code === config.HTTP_SUCCESS) {
                    if (user.password !== '' || loginUser.username !== user.username) {
                        res.send(resp.statusCode, "200");
                    } else {
                        [loginUser.realname, loginUser.phone, loginUser.address] = [user.realname, user.phone, user.address];
                        res.send(resp.statusCode, respJson.data);
                    }
                } else {
                    res.send(resp.statusCode, config.HTTP_ERROR);
                }
            } else {
                res.send(resp.statusCode, config.HTTP_ERROR);
            }
        });
    }
});

/**
 * 获取当前登陆管理员信息
 */
app.post('/show', (req, res) => {
    let user = req.session.user;
    let info = {};
    for (let i in user) {
        info[i] = user[i];
    }
    info.password = '';
    res.send(200, info);
});

/**
 * 退出
 */
app.get('/exit', (req, res) => {
    request.get({url: config.API_BASE_URL + '/user/loginout'}, (err, resp) => {
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
        request.get({url: config.API_BASE_URL + req.originalUrl}, (err, resp, body) => {
            if (err) {
                res.send(500);
                return;
            }
            res.send(resp.statusCode, JSON.parse(body));
        });
    })
    .post((req, res) => {
        logger.info(__filename, "请求参数：", JSON.stringify(req.body));
        request.post({url: config.API_BASE_URL + req.path, form: req.body}, (err, resp, body) => {
            if (err) {
                res.send(500);
                return;
            }
            logger.info(__filename, "响应参数：", JSON.parse(body));
            res.send(resp.statusCode, JSON.parse(body));
        });
    });

module.exports = app;