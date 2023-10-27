const jwt = require('jsonwebtoken');
const User = require('../models/users');
const dotenv = require('dotenv');
dotenv.config();


const TOKEN = process.env.JWT_SECRET;
const auth = async (req, res, next) => {
    try {
        const _token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(_token, TOKEN);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': _token });
        if (!user) {
            throw new Error("Invalid or Expired Token");
        }

        req.token = _token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Unauthorized' })
    }
}

module.exports = auth