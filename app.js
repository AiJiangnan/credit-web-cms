const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const app = express();

const user = require('./route/user');
const middle = require('./route/middle');

app.use(cookieParser());
app.use(session({
    secret: 'aikdw123',
    cookie: {maxAge: 60 * 1000 * 30},
    name: 'NODESESSIONID',
    resave: false,
    saveUninitialized: false
}));

// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({extended: false}));
// 添加静态资源
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

//登录拦截器
app.use((req, res, next) => {
    let url = req.path;
    if (!((url === "/user/login" && req.method === "POST") || url === "/" || req.session.user)) {
        return res.redirect("/");
    }
    next();
});
// 在拦截器后添加静态资源
app.use(express.static(path.join(__dirname, 'public/html')));

app.use('/user', user);
app.use('/', middle);

app.listen(8080);

console.log("successful! http://localhost:8080");