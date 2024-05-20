const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const logger = require('morgan');
const path = require('path');
const db = require('./utils/db')
const jsonwebtoken = require('jsonwebtoken');
const session = require('express-session');

const apiRoutes = require('./routes/apiRoutes');
const viewsRoutes = require('./routes/viewsRoutes');

const app = express();

app.use(session({
    secret: 'someSecretKey',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('./public'))

app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);
app.use('/', viewsRoutes);

module.exports = app;