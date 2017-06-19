var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('projects');

var service = {};

//service.authenticate = authenticate;
service.getAll = getAll;
//service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

/*function authenticate(projectname, password) {
    var deferred = Q.defer();

    db.projects.findOne({ projectname: projectname }, function (err, project) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (project && bcrypt.compareSync(password, project.hash)) {
            // authentication successful
            deferred.resolve({
                _id: project._id,
                projectname: project.projectname,
                firstName: project.firstName,
                lastName: project.lastName,
                token: jwt.sign({ sub: project._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}*/

function getAll() {
    var deferred = Q.defer();

    db.projects.find().toArray(function (err, projects) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return projects (without hashed passwords)
        projects = _.map(projects, function (project) {
            return _.omit(project, 'hash');
        });

        deferred.resolve(projects);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.projects.findById(_id, function (err, project) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (project) {
            // return project (without hashed password)
            deferred.resolve(_.omit(project, 'hash'));
        } else {
            // project not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(projectParam) {
    var deferred = Q.defer();
    console.log("In client servicwe");
    console.log(projectParam.projectname);

    // validation
    db.projects.findOne(
        { projectname: projectParam.projectname },
        function (err, project) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (project) {
                // projectname already exists
                deferred.reject('projectname "' + projectParam.projectname + '" is already taken');
            } else {
                createproject();
            }
        });

    function createproject() {
   
        // set project object to projectParam without the cleartext password
        var project = _.omit(projectParam, 'assignment');

        // add hashed password to project object
       // project.hash = bcrypt.hashSync(projectParam.password, 10);

        db.projects.insert(
            project,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, projectParam) {
    console.log("In last");
    var deferred = Q.defer();

    // validation
    db.projects.findById(_id, function (err, project) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (project.projectname !== projectParam.projectname) {
            console.log("In if");
            // projectname has changed so check if the new projectname is already taken
            db.projects.findOne(
                { projectname: projectParam.projectname },
                function (err, project) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (project) {
                        // projectname already exists
                        deferred.reject('projectname "' + projectParam.projectname + '" is already taken')
                    } else {
                        updateproject();
                    }
                });
        } else {
            updateproject();
        }
    });

    function updateproject() {
        console.log("In final update");
        console.log(projectParam);
        // fields to update
        var set = {
            projectname: projectParam.projectname,
            description: projectParam.description,
            jobcode: projectParam.jobcode
        };

        // update password if it was entered
        /*if (projectParam.password) {
            set.hash = bcrypt.hashSync(projectParam.password, 10);
        }*/

        db.projects.update(
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

    db.projects.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}