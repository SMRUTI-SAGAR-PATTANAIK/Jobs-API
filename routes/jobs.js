const express = require('express');
const Router = express.Router();

const {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs');

Router.get('/', getAllJobs);
Router.get('/:id', getJob);
Router.post('/', createJob);
Router.patch('/:id', updateJob);
Router.delete('/:id', deleteJob);

module.exports = Router;