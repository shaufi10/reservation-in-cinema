/*jshint node: true */
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var logger = require('morgan');
var errorHandler = require('errorhandler');

//MONGOOSE
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/reservation');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
   console.log('[MONGODB] Connect with MoongoDB!');
});

//Bases
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//var favicon = require('serve-favicon');
var routes = require('./routes/indexController.js');
var users = require('./routes/userController.js');
var movies = require('./routes/movieController.js');
var reservations = require('./routes/reservationController.js');
var newses = require('./routes/newsController.js');

//Passport
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var session = require('express-session');
var bcrypt   = require('bcrypt-nodejs');
app.use(session({ secret: 'testowySekret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    users.getmodel.findById(id, function(err, user) {
        done(err, user);
    });
});

var passwordHash = require('password-hash');

passport.use('signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, username, password, done) {
    users.getmodel.findOne({ 'username' :  username }, function(err, user) {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, false, req.flash('signupMsg', 'That user is already existed!'));
        } else {
            var newUser = new users.getmodel();

            newUser.username = username;
            newUser.password = passwordHash.generate(password);
            newUser.name = '';
            newUser.surname = '';
            newUser.phone = '';
            newUser.email = '';
            newUser.isAdmin = false;
            
            newUser.save(function(err) {
                if (err) {
                    return console.error(err);
                }

                console.log("[PASSPORT] Correctly registration");
                return done(null, newUser);
            });
        }

    });
}));

passport.use('login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, username, password, done) {
    users.getmodel.findOne({ username:  username }, function(err, user) {
        if (err) {
            return done(err);            
        }

        if (!user){
            return done(null, false, req.flash('loginMsg', 'There is no user with this nick!'));
        }

        if (!passwordHash.verify(password, user.password)){
            return done(null, false, req.flash('loginMsg', 'Wrong password!'));
        }

        console.log("[PASSPORT] Correctly login!");
        return done(null, user);
    });

}));

//Run server
var httpServer = require("http").createServer(app);
httpServer.listen(3000, function () {
    console.log('Server HTTP is working on 3000 port');
});

// WebSockets
var io = require('socket.io').listen(httpServer);

var msg = io.on('connection', function (socket) {
    console.log("[WEBSOCKETS] Handle event");

    socket.on('addTempSeat', function (movie, day, hour, seats, numberSeatsToReservation, clickedSeat, thisValue) {
        console.log("[WEBSOCKETS] Add temporary seats: "  + movie + ", " + day + ", " + hour + ", " + thisValue + ", Number of tickets: " + numberSeatsToReservation);
        var movieData = movie
                        + "_" 
                        + day 
                        + "_" 
                        + hour;
        
            var reservation = new reservations.getmodel({ movie_data: movieData, seat: thisValue, tempReservation: true, tickets: clickedSeat });

            reservation.save(function(e, data){
                if (e) {
                    return console.error(err);
                }
                socket.broadcast.emit('addTempSeatToEveryone', data, movie, day, hour);
            });
              
        setTimeout(function(){
            console.log("[WEBSOCKETS] Checking...");
            for (var i = 0; i < seats.length; i++) {
//                console.log("Seats: " + seats[i]);
                reservations.getmodel.find({ movie_data: movieData, seat: seats[i] }, function (err, data) {
//                    console.log(data);
                    if(data[0] !== undefined //is deleted?
                        && data[0].tempReservation == true //is this already static place?
                        && data[0].tickets == clickedSeat) { //somebody clicked more then 1 time?
                        
                        console.log("[WEBSOCKETS] Delete temporary seats. Reason: timout");
                        reservations.getmodel.remove({ movie_data: movieData, seat: data[0].seat }, function(e){
                            if (e) {
                                return console.error(err);
                            }
                            socket.emit('deleteTempSeatToUser', data[0].seat, movie, day, hour);
                            socket.broadcast.emit('deleteTempSeatToEveryone', data[0].seat, movie, day, hour);
                        });
                    }
                });
            }
        }, numberSeatsToReservation * 10 * 1000);
    });
    
    socket.on('changeTicketsOfTempSeats', function (movie, day, hour, seats, clickedSeat) {
        var movieData = movie
                        + "_" 
                        + day 
                        + "_" 
                        + hour; 

        for (var i = 0; i < seats.length; i++) {
        
            reservations.getmodel.findOneAndUpdate({ movie_data: movieData, seat: seats[i] }, 
                                                   { tickets: clickedSeat },
                                                   function(e){
                if (e) {
                    return console.error(err);
                }
            });      
        };
        socket.broadcast.emit('addTempSeatToEveryone', seats, movie, day, hour);
    });
    
    socket.on('deleteTempSeat', function (movie, day, hour, seat) {
        console.log("[WEBSOCKETS] Delete temporary seats: "  + movie + ", " + day + ", " + hour + ", { " + seat + " }");
        var movieData = movie
                        + "_" 
                        + day 
                        + "_" 
                        + hour; 

        reservations.getmodel.remove({ movie_data: movieData, seat: seat }, function(e){
            if (e) {
                return console.error(err);
            }
            socket.broadcast.emit('deleteTempSeatToEveryone', seat, movie, day, hour);
        });
    });
    
    socket.on('deleteAllTempSeats', function (movie, day, hour, seats) {
        console.log("[WEBSOCKETS] Delete ALL temporary seats: "  + movie + ", " + day + ", " + hour + ", { " + seats + " }");
        var movieData = movie
                        + "_" 
                        + day 
                        + "_" 
                        + hour; 
        
        for (var i = 0; i < seats.length; i++) {
            reservations.getmodel.remove({ movie_data: movieData, seat: seats[i] }, function(e){
                if (e) {
                    return console.error(err);
                }
            });           
        };

        socket.broadcast.emit('deleteAllTempSeatToEveryone', seats, movie, day, hour);
    });

    socket.on('addStaticSeats', function (seats, movie, day, hour, name, surname, email, phone) {
        console.log("[WEBSOCKETS] Add permanent seats: "  + name + ", " + surname + ", " + email + ", " + phone  + ", { " + seats + " }");
        var movieData = movie
                        + "_" 
                        + day 
                        + "_" 
                        + hour;
        for (var i = 0; i < seats.length; i++) {

            reservations.getmodel.findOneAndUpdate({ movie_data: movieData, seat: seats[i] }, 
                                                   { name: name, surname: surname, email: email, phone: phone, tempReservation: false },
                                                   function(e, data){
                if (e) {
                    return console.error(err);
                }
            });      
        };

        socket.broadcast.emit('addStaticSeatsToEveryone', seats, movie, day, hour);
    });
});

var env = process.env.NODE_ENV || 'development';
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

if ('development' === env) {
    app.use(logger('dev'));
    app.use(errorHandler());
}


app.get('/', routes.index());

/* Login and registration */
app.get('/login', routes.login());
app.post('/login', passport.authenticate('login', {
    successRedirect : '/edituser',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get('/signup', routes.signup());
app.post('/signup', passport.authenticate('signup', {
    successRedirect : '/edituser',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
    }
    
	res.redirect('/');
}

//Just in case:
//admin admin1
function isLoggedAdminIn(req, res, next) {
	if (req.isAuthenticated() && req.user.isAdmin == true){
		return next();
    }
    
	res.redirect('/');
}

/* User */
app.get('/showuser', isLoggedAdminIn, users.showuser());
app.get('/deleteuser', isLoggedAdminIn, users.deleteuser());
app.get('/edituser', isLoggedIn, users.edituser());
app.post('/deleteuserCRUD', isLoggedAdminIn, users.deleteuserCRUD());
app.post('/edituserCRUD', users.edituserCRUD());

/* Movie */
app.get('/showmovie', isLoggedAdminIn, movies.showmovieCRUD());
app.get('/addmovie', isLoggedAdminIn, movies.addmovie());
app.get('/deletemovie', isLoggedAdminIn, movies.deletemovie());
app.get('/editmovie', isLoggedAdminIn, movies.editmovie());
app.post('/addmovieCRUD', isLoggedAdminIn, movies.addmovieCRUD());
app.post('/deletemovieCRUD', isLoggedAdminIn, movies.deletemovieCRUD());
app.post('/editmovieCRUD', isLoggedAdminIn, movies.editmovieCRUD());

/* AJAX - bases data */
app.post('/getmovies', movies.getmovies);
app.post('/getdays', movies.getdays);
app.post('/gethours', movies.gethours);

/* Reservation */
app.post('/getreservation', reservations.getreservation);

/* AJAX - get information about seat */
app.post('/getinformationaboutseat', reservations.getinformationaboutseat);

/* Newses */
app.post('/shownews', newses.shownewsCRUD());
app.get('/addnews', isLoggedAdminIn, newses.addnews());
app.get('/deletenews', isLoggedAdminIn, newses.deletenews());
app.get('/editnews', isLoggedAdminIn, newses.editnews());
app.post('/addnewsCRUD', isLoggedAdminIn, newses.addnewsCRUD());
app.post('/deletenewsCRUD', isLoggedAdminIn, newses.deletenewsCRUD());
app.post('/editnewsCRUD', isLoggedAdminIn, newses.editnewsCRUD());

/* AJAX - get sellout */
app.post('/getsellout', newses.getsellout);

app.use(function (req, res) {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.end('There is no site on this address!');
});