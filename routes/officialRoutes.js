const express = require('express');
const officialRouter = express.Router();
const {getAllApplications, approveRejectStartup} = require('../controllers/officialController');
const auth = require('../middleware/auth');

officialRouter.get('/applications', auth, getAllApplications);
officialRouter.put('/approve-reject/:id', auth, approveRejectStartup);

module.exports = officialRouter;