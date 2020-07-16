const express = require('express');
const sequelize1 = require('./connections/database1');
const sequelize2 = require('./connections/database2');
const {client} = require('./connections/redis-connection');
const config = require('config');
const movies = require('./routes/movieRouter');
const users = require('./routes/userRouter');
const app = express();

if(!config.get('jwtPrivateKey')){
    console.error('jwtPrivateKey is not defined');
    process.exit(1);
}

app.use(express.json());
app.use('/api/movies', movies);
app.use('/api/users', users);

app.listen(3000);