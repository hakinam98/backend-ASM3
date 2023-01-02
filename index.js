const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const http = require('http');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const mongodbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@asignment3.yqul0gy.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
// const mongodbUrl = process.env.MONGO_URL;

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const historyRoutes = require('./routes/history');
const admminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');

const User = require('./models/user');




const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
// app.use(cookieParser());
app.use(morgan('combined', { stream: accessLogStream }))


const store = new MongoDBStore({
    uri: mongodbUrl,
    collection: 'sessions'
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '.jpg')
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}


app.use(multer({ storage: storage, fileFilter: fileFilter }).any('files'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: 'my secret', resave: false, saveUninitialized: false, store: store
}));

app.use(flash());


app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    try {
        const user = User.findById(req.session.user._id)
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
})

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
//     next();
// })
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//     next();
// });

app.use('/users', authRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use(checkoutRoutes);
app.use('/histories', historyRoutes);
app.use('/admin', admminRoutes);
app.use('/chatrooms', chatRoutes)

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    const data = error.data
    res.status(status).json({ message: message, data: data })
})

const server = http.createServer(app);
mongoose.set('strictQuery', true);
mongoose.connect(mongodbUrl)
    .then(result => {
        server.listen(process.env.PORT || 5000);
        const io = require('./socket').init(server);
        io.on('connection', socket => {
            console.log('Client connected!');
            socket.on('send_message', data => {
                console.log('add message!', data)
                io.emit('receive_message_server', { data })
            });
            socket.on('send_message_server', data => {
                console.log('Server add message!', data)
                io.emit('receive_message', { data })
            })
        })
    })
    .catch(err => console.log(err))

module.exports = server;