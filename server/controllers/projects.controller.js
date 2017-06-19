var config = require('config.json');
var express = require('express');
var router = express.Router();
var projectsService = require('services/projects.service');
var userService = require('services/user.service');

// routes
router.get('/getAll', getAll);
router.get('/getAllEmployees', getAllEmployees)
//router.post('/authenticate', authenticate);
router.post('/addProject', addProject);

//router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
//router.delete('/deleteProjects', deleteProjects);

module.exports = router;

function addProject(req, res) {
    console.log("In get all controller");
    projectsService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    
    projectsService.getAll()
        .then(function (projects) {
            res.send(projects);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllEmployees(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    console.log("In update controller");
    console.log(req.params._id);
    console.log(req.body);
    projectsService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    console.log("In delete project");
    console.log(req.body);
    projectsService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteProjects(req, res) {
    console.log("In delete project");
    console.log(req.body);
    projectsService.delete(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    
}