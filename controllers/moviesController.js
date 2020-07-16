const {Movie} = require('../models/movieModel');

exports.getMovies = async(req, res)=>{
    const movie = await Movie.findAll();
    res.send(movie);
}

exports.postMovies = (req, res)=>{
    Movie.create({
    email: req.body.email,    
    name: req.body.name
}).then(movie =>{
    res.send(movie);
})
}

exports.updateMovies = (req, res)=>{
    Movie.update({name: req.body.name}, {where: {id: req.params.id}})
    .then(() =>{
        res.send( "Name updated successfully");
    }).catch(err => {
        console.log(err);
    });
}

exports.deleteMovies = (req, res)=>{
    Movie.destroy({where : {id: req.params.id}}).then(movie =>{
        res.sendStatus(200).send(movie);
    });
}