const AuthLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.status(400).json({ message: 'You are not login!' })
    }
    next();
}

module.exports = AuthLogin;