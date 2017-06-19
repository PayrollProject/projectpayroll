var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('locations');

var service = {};

//service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

/*function authenticate(locationName, password) {
    var deferred = Q.defer();

    db.locations.findOne({ locationName: locationName }, function (err, location) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (location && bcrypt.compareSync(password, location.hash)) {
            // authentication successful
            deferred.resolve({
                _id: location._id,
                locationName: location.locationName,
                firstName: location.firstName,
                lastName: location.lastName,
                token: jwt.sign({ sub: location._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}
*/
function getAll() {
    var deferred = Q.defer();

    db.locations.find().toArray(function (err, locations) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return locations (without hashed passwords)
        locations = _.map(locations, function (location) {
            return _.omit(location, 'hash');
        });

        deferred.resolve(locations);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.locations.findById(_id, function (err, location) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (location) {
            // return location (without hashed password)
            deferred.resolve(_.omit(location, 'hash'));
        } else {
            // location not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(locationParam) {
    var deferred = Q.defer();

    // validation
    db.locations.findOne(
        { locationName: locationParam.locationName },
        function (err, location) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (location) {
                // locationName already exists
                deferred.reject('location "' + locationParam.locationName + '" is already registered');
            } else {
                createlocation();
            }
        });

    function createlocation() {
        // set location object to locationParam without the cleartext password
        //var location = _.omit(locationParam, 'password');
        /*var location;
        location.locationname=locationParam.locationName;
        location.country=locationParam.locationCountry;
        location.address=locationParam.locationAddress+", "+locationParam.locationAddress2+", "+locationParam.locationCity+", "+locationParam.locationState+", "+locationParam.locationZip;
        location.phone=locationParam.locationPhone;
        location.billrate=locationParam.locationDefaultBillRate;*/
        // add hashed password to location object
        //location.hash = bcrypt.hashSync(locationParam.password, 10);

        db.locations.insert(
            location,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, locationParam) {
/*    var deferred = Q.defer();

    // validation
    db.locations.findById(_id, function (err, location) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (location.locationName !== locationParam.locationName) {
            // locationName has changed so check if the new locationName is already taken
            db.locations.findOne(
                { locationName: locationParam.locationName },
                function (err, location) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (location) {
                        // locationName already exists
                        deferred.reject('locationName "' + req.body.locationName + '" is already taken')
                    } else {
                        updatelocation();
                    }
                });
        } else {
            updatelocation();
        }
    });

    function updatelocation() {
        // fields to update
        var set = {
            firstName: locationParam.firstName,
            lastName: locationParam.lastName,
            locationName: locationParam.locationName,
        };

        // update password if it was entered
        if (locationParam.password) {
            set.hash = bcrypt.hashSync(locationParam.password, 10);
        }

        db.locations.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }
*/
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.locations.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}