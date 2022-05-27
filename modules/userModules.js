const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: [ true, 'User must have a username' ],
        unique: true,
    },
    password: {
        type: String,
        require: [ true, 'User must have a password' ]
    }
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users