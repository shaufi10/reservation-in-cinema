/*jshint browser: true, globalstrict: true, devel: true */
/*globals io: false */
"use strict";

/* Default */
var mongoose = require('mongoose');
var newsSchema = mongoose.Schema({
    title: String,
    content: String
});
var newsModel = mongoose.model('newsModel', newsSchema);

exports.getmodel = newsModel;

exports.shownewsCRUD = function () {
    return function (req, res) {
        newsModel.find( function (err, data) {
             res.json({
                "newses": data
            });           
        });
    };
};

exports.addnews = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Add news',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'addnews',
            msg: 'none'
        });
    };
};

exports.deletenews = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Delete news',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'deletenews',
            msg: 'none'
        });
    };
};

exports.editnews = function () {
    return function (req, res) {
        res.render('index', {
            title: 'Edit news',
            user: req.user == undefined ? 'none' : req.user,
            returnList: 'none',
            action: 'editnews',
            msg: 'none'
        });
    };
};

/* CRUD */
exports.addnewsCRUD = function () {
    return function (req, res) {        
        var title = req.body.title;
        var content = req.body.content;
        
        var news = new newsModel({ title: title, content: content });
        
        news.save(function (err) {
            if (err) {
                return console.error(err);
            }
            res.location("/");
            res.redirect("/");
        });
    };
};
                          
exports.deletenewsCRUD = function () {
    return function (req, res) {
        var title = req.body.title;
        
        newsModel.find({ title: title }).remove( function (err) {
           if (err) {
                return console.error(err);
            }
            res.location("/");
            res.redirect("/");
        });
    };
};

exports.editnewsCRUD = function () {   
    return function (req, res) {
        var title = req.body.title;
        var newTitle = req.body.newtitle;
        var newContent = req.body.newcontent;
        var newSellout = req.body.newsellout
        
        newsModel.findOneAndUpdate({ title: title}, 
                                   { title: newTitle, content: newContent }, 
                                   function (err) {
            if (err) {
                return console.error(err);
            }
            res.location("/");
            res.redirect("/"); 
        });  
    };
};

/* AJAX */
exports.getsellout = function (req, res) {        
    newsModel.find( function (err, data) {
         res.json({
            "newses": data
        });           
    });
};