const {User} = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const {client} = require('../connections/redis-connection');
 
exports.registration = async(req, res)=>{
    let user = await User.findOne({where: {email: req.body.email}});

    if(user){
        res.status(400).send('User already exists');
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    user = User.create({
        name: req.body.name,
        email: req.body.email,  
        password: password
    }).then((user) => {
        res.send(user);
    });

}

exports.login =  async(req, res)=>{
    const user = await User.findOne({where: {email: req.body.email}});

    if(!user){
        res.status(400).send('Invalid email or password');
        return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).send('Invalid email or password');
        return;
    }

    const accesstoken = jwt.sign({id:user.id}, config.get('jwtPrivateKey'), {expiresIn: '15m'});

    client.set(user.email, accesstoken, function(err){
        if(err){
            throw err;
        }else{
            client.get(user.email, function(err, value){
                if(err){
                    throw err;
                }else{
                    console.log(value);
                }
            });
        }
    });

    res.send(accesstoken);
}

exports.changePassword = async(req, res)=>{
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    if(req.body.password === ""){
        res.send('Please provide password to be updated')
    }else{
        User.update({password: password}, {where: {email: req.body.email}})
        .then(() =>{
            res.send( "password updated successfully");
        }).catch(err => {
            console.log(err);
        }); 
    }

    var email = req.header('email');

    client.del(email, function(err, value){
        if(err){
            throw err;
        }else{
            console.log(value);
        }
    })
}

exports.logout = async(req, res)=>{
    const user = await User.findOne({where: {email: req.body.email}});

    if(!user){
        res.status(400).send('Invalid email or password');
        return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).send('Invalid email or password');
        return;
    }

    var email = req.header('email');

    client.del(email, function(err, value){
        if(err){
            throw err;
        }else{
            console.log(value);
        }
    })

    res.send('Logged out')
}

