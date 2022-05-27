const User = require('../modules/userModules');

const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
    
    try {
        const { userName, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            userName,
            password: hashPassword
        });
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: newUser
        })
    } catch (err) {
        res.status(400)
    }
}

exports.logIn = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({ 
                    status: 'failed',
                    message: 'User not found'
            });
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: 'success'
            });
            console.log(req.session)
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Invalid username or password'
            })
        }
    } catch (err) {
        res.status(400)
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        console.log('getAllUsers', users)
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: users
        });
    } catch (err) {
        res.status(400);
    }
};