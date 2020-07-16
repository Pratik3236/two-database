const {client} = require('../connections/redis-connection');

function auth(req, res, next){
    var email = req.header('email');

    client.get(email, function(err, value){
        if(err){
            throw err;
        }else{
            console.log(value);
            if(value == null){
                res.send('You have been logged out');
                return;
            }else{
                next();
            }
        }
    });
}

module.exports = auth;