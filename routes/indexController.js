/*jshint browser: true, globalstrict: true, devel: true */
/*globals io: false */
"use strict";

/* Default */
exports.index = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Reservation',
            user: req.user == undefined ? 'none' : req.user,
            action: 'none',
            msg: 'none'
        });
    };
};

exports.login = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Login',
            user: req.user == undefined ? 'none' : req.user,
            action: 'login',
            msg: 'none'
        });
    };
};
exports.signup = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Registration',
            user: req.user == undefined ? 'none' : req.user,
            action: 'signup',
            msg: 'none'
        });
    };
};