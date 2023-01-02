const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    const email = req.query.email;
    const password = req.query.password;
    const fullName = req.query.fullname;
    const phone = req.query.phone;
    console.log(req.query)
    try {
        const hashedPw = await bcrypt.hash(password, 12)
        const user = new User({
            email: email,
            password: hashedPw,
            fullName: fullName,
            phone: phone,
            role: 'customer'
        })
        const userDoc = await User.findOne({ email: email })
        if (userDoc) {
            res.status(203).json({ message: 'E-mail address already exists!' })
            // const error = new Error('E-mail address already exists!');
            // error.statusCode = 422;
            // error.data = errors.array();
            // throw error;
        }
        else {
            const result = await user.save()
            res.status(201).json({ message: "User created!", userId: result._id })
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.query.email;
    const password = req.query.password;
    console.log(req.query)
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(203).json({ message: 'A user with this email could not be found.' })
            // const error = new Error('A user with this email could not be found.')
            // error.status = 401;
            // throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, loadedUser.password)
        if (!isEqual) {
            return res.status(203).send({ message: 'Wrong password!' })
            // const error = new Error('Wrong password!');
            // error.status = 401;
            // throw error;
        }
        const token = jwt.sign({ email: email, userId: user._id.toString() }, 'somesupersecretsecret', { expiresIn: '1h' })
        req.session.isLoggedIn = true;
        req.session.user = user;
        await req.session.save()
        return res.status(200).json({ message: 'Login successfully!', userId: user._id.toString(), token: token })

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.getDetailData = async (req, res, next) => {
    const userId = req.params.userId
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: 'User not found with this UserId!' })
        }
        res.status(200).json({ fullname: user.fullName })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}