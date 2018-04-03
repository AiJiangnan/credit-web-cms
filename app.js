const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();

const user = require('./route/user');

app.use(session({
    secret: 'aikdw123',
    cookie: {maxAge: 60 * 1000 * 30},
    resave: false,
    saveUninitialized: true
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
    let url = req.originalUrl;
    if (!((url === "/login" && req.method === "POST") || url === "/" || req.session.user)) {
        return res.redirect("/");
    }
    next();
});
// 在拦截器后添加静态资源
app.use(express.static(path.join(__dirname, 'public/html')));

app.use('/', user);

app.listen(8000);

console.log("successful! http://localhost:8000");