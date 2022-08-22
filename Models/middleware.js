const jwt = require('jsonwebtoken');
const { model } = require('mongoose');

let middleware = (req,res,next) =>{

    try {

        let token = req.header('x-token');
        if(!token){
            return res.status(400).send('Token Not Found')
        }

        let decode = jwt.verify(token,'jwtPassword')

        req.users = decode.users;

        next();
        
    } catch (error) {
        
        console.log(error);

        return res.status(400).send('Authentication Error');
    }

}

module.exports = middleware;