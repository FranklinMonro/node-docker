const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { createClient } = require("redis")
const cors = require("cors");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

let RedisStore = require("connect-redis")(session)

let redisClient = createClient({ 
    host: REDIS_URL,
    port: REDIS_PORT,
});

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const mongUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithTry = () => {
    mongoose.connect(mongUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => { console.log('success connecting to MongoDB')})
    .catch((err) => { 
        console.log(err);
        setTimeout(connectWithTry, 5000);
    });
}
connectWithTry();

app.use(express.json());

app.enable('trust proxy');
app.use(cors({}));
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 60000
        }
    })
)

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.get('/', (req, res) => {
    res.send('Hi to node-docker!!!');
    console.log('check if Nginx is working properly', new Date().getTime());
});

app.use('/posts', postRoutes);
app.use('/users', userRoutes);





const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));

