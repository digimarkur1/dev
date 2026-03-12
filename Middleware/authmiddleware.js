const jwt = require('jsonwebtoken');

function authtoken(req, res, next) {
    //Bearer TOKEN
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    //is 1st case true then after '&&' case will happen
    //is 1st case false then it not return after '&&' case

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
            
        req.user = user
        next()
    })
}
module.exports = authtoken