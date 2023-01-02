const jwt = require('jsonwebtoken')

const AuthLogin = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecret')
    }
    catch (err) {
        err.status = 500;
        throw err;
    }
    if (!decodedToken) {
        res.status(401).json({ message: 'You are not login!' })
    }
    req.userId = decodedToken.userId;
    next();
}

module.exports = AuthLogin;