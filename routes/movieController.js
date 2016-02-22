/*jshint browser: true, globalstrict: true, devel: true */
/*globals io: false */
"use strict";

/* Default */
var mongoose = require('mongoose');
var movieSchema = mongoose.Schema({
    name: String,
    hall: String,
    day: String,
    hour: String
});
var movieModel = mongoose.model('movieModel', movieSchema);

exports.getmodel = movieModel;

exports.showmovieCRUD = function () {
    return function (req, res) {
        movieModel.find( function (err, movies) {
            res.render('index', {
                title: 'Show movies',
                user: req.user == undefined ? 'none' : req.user,
                returnList: movies,
                action: 'showmovie',
                msg: 'none'
            });            
        });
    };
};

exports.addmovie = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Add movie',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'addmovie',
            msg: 'none'
        });
    };
};

exports.deletemovie = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Delete movie',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'deletemovie',
            msg: 'none'
        });
    };
};

exports.editmovie = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Edit movie',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'editmovie',
            msg: 'none'
        });
    };
};

/* CRUD */
exports.addmovieCRUD = function () {
    return function (req, res) {
        var movieName = req.body.movie;
        var hallNumber = req.body.hall;
        var days = req.body.day;
        var hours = req.body.hour;
        
        var firstLoop = days.constructor === Array ? days.length : 1;
        var secondLoop = hours.constructor === Array ? hours.length : 1;
        
        for (var i = 0; i < firstLoop; i++) {
            for (var j = 0; j < secondLoop; j++) {
                var daysToInput = days.constructor === Array ? days[i] : days;
                var hourToInput = hours.constructor === Array ? hours[j] : hours;
                var movie = new movieModel({ name: movieName, hall: hallNumber, day: daysToInput, hour: hourToInput });

                movie.save(function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });                
            }
        }
        
        res.location("showmovie");
        res.redirect("showmovie");
    };
};

exports.deletemovieCRUD = function () {
    return function (req, res) {
        var movieName = req.body.movie;

        movieModel.find({ name: movieName }).remove( function (err) {
            if (err) {
                return console.error(err);
            }
            res.location("showmovie");
            res.redirect("showmovie");
        });
    };
};

exports.editmovieCRUD = function () {
    return function (req, res) {        
        var movieName = req.body.movie;   
        var movieDay = req.body.day;   
        var hourName = req.body.hour;
        
        var movieNameNew = req.body.movieNew;
        var hallNumberNew = req.body.hallNew;
        var dayNew = req.body.dayNew;
        var hourNew = req.body.hourNew;
        
        movieModel.findOneAndUpdate({ name: movieName, day: movieDay, hour: hourName }, 
                                    { name: movieNameNew, hall: hallNumberNew, day: dayNew, hour: hourNew}, 
                                    function (err) {
                 if (err) {
                    return console.error(err);
                }
                res.location("showmovie");
                res.redirect("showmovie");            
        });   
    };
};

/* AJAX */
exports.getmovies = function (req, res) {
    movieModel.find( function (err, data) {
        res.json({
            movies: data
        });            
    });
};

exports.getdays = function (req, res) {
    var movieName = req.body.movieName;
    
    movieModel.find({ name: movieName }, function (err, data) {
        res.json({
            days: data
        });
    });
};

exports.gethours = function (req, res) {
    var movieName = req.body.movieName;
    var movieDay = req.body.movieDay;
    
    movieModel.find({ name: movieName, day: movieDay }, function (err, data) {
        res.json({
            hours: data
        });
    });
};