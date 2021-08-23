const express = require('express')
require('./db/database')
const morgon = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//import Routes
const userRouter = require('./routes/usersRoute');
const postRouter = require('./routes/postRoute');

const app = express()
const port = process.env.PORT || 4000

//middlewares
app.use(morgon('dev')); //just specifies routes in console like:- ( POST /signup 201 time )
app.use(cookieParser());
app.use(bodyParser.json({limit:"50mb", extended: true}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors())

//Routes
app.use("/api" , userRouter)
app.use("/api" , postRouter)

/**
 * express Listener.
 * @param {number}} port- Port on which server is runnung.
 */
app.listen(port , () => {
    console.log('server is running on port ' +port)
})