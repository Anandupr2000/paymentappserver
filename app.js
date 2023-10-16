var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var paymentRouter = require('./routes/payment');
var session = require('express-session');

var app = express();
const cors = require('cors');

// importing db connection file
var db = require('./db/connect')

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:"Key",cookie:{maxAge:900000}})) // sesion created ,then assign session to logged in user

db.connect( // must be called before router (sometimes data need to be retrieved on first loading)
            (err)=>{
              if(err) console.log("Database Connection Error "+err);
            }
          )

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/payment',paymentRouter)

module.exports = app;
