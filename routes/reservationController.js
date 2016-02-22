/*jshint browser: true, globalstrict: true, devel: true */
/*globals io: false */
"use strict";

/* Default */
var mongoose = require('mongoose');
var reservationSchema = mongoose.Schema({
    movie_data: String,
    seat: String,
    name: String,
    surname: String,
    email: String,
    phone: String,
    tempReservation: Boolean,
    tickets: Number
});
var reservationModel = mongoose.model('reservationModel', reservationSchema);

exports.getmodel = reservationModel;
        
exports.getreservation = function (req, res) {
    var movieData = req.body.movieName 
                    + "_" 
                    + req.body.movieDay 
                    + "_" 
                    + req.body.movieHour;      
    
    reservationModel.find({ movie_data: movieData }, function (err, data) {
//        console.log("[AJAX] what get ajax:");
//        console.log(data);
        res.json({
            "txt": "[AJAX - BOOKING] Ajax get permanently seats",
            "reservations": data
        });
    });
};

exports.getinformationaboutseat = function (req, res) {
    var movieData = req.body.movieName 
                    + "_" 
                    + req.body.movieDay 
                    + "_" 
                    + req.body.movieHour;  
    
    var seat = req.body.seat;         
    
    reservationModel.find({ movie_data: movieData, seat: seat}, function (err, data){
        res.json({
            "reservation": data
        });        
    });
};
