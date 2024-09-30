const express = require('express');
const startupRouter = express.Router();
const {registerStartup,getStartupStatus,updateStartup,getAllStartups,getStartupDetails } = require('../controllers/startupContoller');
const auth = require('../middleware/auth');

startupRouter.post('/register', registerStartup);
startupRouter.put('/update', auth, updateStartup);
startupRouter.get('/status', auth, getStartupStatus);
startupRouter.get('/all', getAllStartups);
startupRouter.get('/:id', getStartupDetails);

module.exports = startupRouter;