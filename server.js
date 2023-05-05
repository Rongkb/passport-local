var express = require('express');
var app = express();
const path = require('path')
var jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
var passport = require('passport');
const session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
require('./src/helper/connect_mongodb')
const { AcountModel } = require('./src/model/accountModel');

require('dotenv').config()
const port = process.env.PORT || 3000
app.use(cookieParser())
var bodyParser = require('body-parser');

app.use('/static', express.static(path.join(__dirname, 'src/public')))
app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.json('chao mung den voi trang Home')
})
// passport

app.use(session({
    secret: 'mysecret',
    resave: false, // Thêm tùy chọn resave
    saveUninitialized: false // Thêm tùy chọn saveUninitialized
}));
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/private', (req, res, next) => {
    var token = req.headers['authorization'].split(' ')[1]
    console.log('token: ', token)
    jwt.verify(token, '123', function (err, data) {
        if (err) return res.status(403).json('Invalid token')
        next()
    })
}, (req, res, next) => {
    res.json('du lieu bi mat')
})

app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, './src/view/login.html'))
})

passport.use(new LocalStrategy((username, password, done) => {
    AcountModel.findOne({
        username: username,
        password: password
    })
        .then(data => {
            if (!data) done(null, false)
            done(null, data)
        })
        .catch(err => {
            done(err)
        })

}
))

app.post("/passport", function (req, res, next) {
    console.log(req.body)
    passport.authenticate('local', function (err, user) {
        if (err) {
            return res.status(500).json('loi servet')
            // console.log('err')
        }
        if (!user) {
            return res.json('ussernamr pasd ko hop le')
            // console.log('user')
        }
        jwt.sign({ user }, '123', function (err, token) {
            console.log('err: ', err)
            if (err) return res.status(500).json('loi server')
            return res.json(token)
        })
    })(req, res, next);
});




app.use((err, req, res, next) => {
    res.status(500).json({
        message: " thong bao loi tu server ",
        status: err
    })
})
app.listen(port, function () {
    console.log(`servering running in port: ${port}`)
})