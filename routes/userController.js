/*jshint browser: true, globalstrict: true, devel: true */
/*globals io: false */
"use strict";

/* Default */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
    email: String,
    phone: String,
    isAdmin: Boolean
});
var userModel = mongoose.model('userModel', userSchema);

exports.getmodel = userModel;

exports.showuser = function () {
    return function (req, res) {
        userModel.find( function (err, users) {
            res.render('index', {
                title: 'Show users',
                user: req.user == undefined ? 'none' : req.user,
                returnList: users,
                action: 'showuser',
                msg: 'none'
            });            
        });
    };
};

exports.deleteuser = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Delete user',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'deleteuser',
            msg: 'none'
        });
    };
};

exports.edituser = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Edit user',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'edituser',
            msg: 'none'
        });
    };
};

/* CRUD - adding user is in app.js */
exports.deleteuserCRUD = function () {
    return function (req, res) {
        var username = req.body.username;

        userModel.find({ username: username }).remove( function (err) {
            if (err) {
                return console.error(err);
            }
            res.location("showuser");
            res.redirect("showuser");
        });
    };
};

exports.edituserCRUD = function () {
    return function (req, res) {
        var username = req.user.username;
        
        var NameNew = req.body.nameNew;
        var SurnameNew = req.body.surnameNew;
        var EmailNew = req.body.emailNew;
        var PhoneNew = req.body.phoneNew;
        
        userModel.findOneAndUpdate({ username: username }, 
                                   { name: NameNew, surname: SurnameNew, email: EmailNew, phone: PhoneNew}, 
                                   function (err){
            if (err) {
                return console.error(err);
            }
            res.location("edituser");
            res.redirect("edituser");    
        });
    };
};