'use strict'
const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
    let token = await jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
    return token;
};

exports.decodeToken = async (token) => {
    let data = await jwt.verify(token, global.SALT_KEY);
    return data;
};

exports.authorize = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Acesso restrito'            
        });
    } else {
        jwt.verify(token, global.SALT_KEY, (error, decod) => {
            if (error) {
                res.status(400).json({
                    message: 'Token inválido'
                });
            } else {
                next();
            }
        });
    }
};