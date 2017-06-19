var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var secret = 'harrypotter';
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package
db.bind('users');
db.bind('company');

var service = {};
var client = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'poonam25.modani@gmail.com', // Your email address
            pass: 'poonam!modani' // Your password
        },
        tls: { rejectUnauthorized: false }
    });
service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.forgotPassword=forgotPassword;
//service.resetPassword=resetPassword;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ email: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    console.log("In user service create");
    console.log(userParam);
    var deferred = Q.defer();
        var company_info = {
            'companyname' : userParam.companyname,
            'companysize' : userParam.companysize,
            'industry' : userParam.industry
        };
        db.company.insert(company_info,function(err,company){
            var user;
                user = _.omit(userParam, 'password');
                user = _.omit(user,'companysize');
                user = _.omit(user,'industry');
                user = _.omit(user,'rpassword');
                user = _.omit(user,'companyname');
            if (err) deferred.reject(err.name + ': ' + err.message);
                
                // add hashed password to user object
                user.hash = bcrypt.hashSync(userParam.password, 10);
                user.companyid = company.ops[0]._id;
                user.status = "Active";
                /*user_name = user.fullname;
                user_name = user_name.split(" ");
                user.firstName = user_name[0];
                user.lastName = user_name[1]; */
                
            db.users.insert(
                user,
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    deferred.resolve();
                });

        });
       
    

    return deferred.promise;
}

function forgotPassword(userParam) {
    console.log(userParam);
    var deferred = Q.defer();

    db.users.findOne({ email: userParam.resetemail },function(err, user) {
            if (err) {
                //deferred.reject(err.name + ': ' + err.message);
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'poonam25.modani@gmail.com',
                    to: 'poonam25.modani@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                        deferred.reject(err.name + ': ' + err.message);
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                deferred.reject(err.name + ': ' + err.message);
                //res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                if (!user) {
                    deferred.reject('Username "' + user.email + '" is not found');
                    //res.json({ success: false, message: 'Username was not found' }); // Return error if username is not found in database
                }  else {
                    user.resettoken = jwt.sign({ username: user.email, email: user.email }, config.secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
                    // Save token to user in database
                    /*user.save(function(err) {
                        if (err) {
                            //res.json({ success: false, message: err }); // Return error if cannot connect
                            deferred.reject(err.name + ': ' + err.message);
                        } else {
                            console.log("In Save and send email successfully");
                            // Create e-mail object to send to user
                            var email = {
                                from: 'poonam25.modani@gmail.com',
                                to: user.email,
                                subject: 'Reset Password Request',
                                text: 'Hello ' + user.firstName + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:3000/users/resetPassword/' + user.resettoken,
                                html: 'Hello<strong> ' + user.firstName + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:3000/users/resetPassword/' + user.resettoken + '">http://localhost:3000/users/resetPassword/</a>'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console
                                    console.log('sent to: ' + user.email); // Log e-mail 
                                }
                            });
                            deferred.resolve();
                            //res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
                        }
                    });*/

                    db.users.update(
                        { _id: mongo.helper.toObjectID(user._id) },
                        { $set: user },
                        function (err, doc) {
                            if (err){
                                deferred.reject(err.name + ': ' + err.message);  
                          } else{
                                console.log("In Save and send email successfully");
                                console.log(config.apiUrl);
                            // Create e-mail object to send to user
                            var email = {
                                from: 'poonam25.modani@gmail.com',
                                to: user.email,
                                subject: 'Reset Password Request',
                                text: 'Hello ' + user.fullname + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="'+config.apiUrl+'/users/resetPassword?' + user.resettoken,
                                html: 'Hello<strong> ' + user.fullname + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="'+config.apiUrl+'/users/resetPassword?'+user.resettoken+'">'+config.apiUrl+'/users/resetPassword/</a>'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console
                                    console.log('sent to: ' + user.email); // Log e-mail 
                                }
                            });
                            deferred.resolve();   
                          }

                            //deferred.resolve();
                    });
                }
            }
        });
    // validation
    /*db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                //createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }*/

    return deferred.promise;
}

/*
function resetPassword(resettoken){
    //var deferred = Q.defer();
    console.log(resettoken);
    //console.log(userParam);
    //return deferred.promise;
}*/

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}