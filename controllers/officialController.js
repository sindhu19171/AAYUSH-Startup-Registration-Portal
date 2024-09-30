const Startup = require('../models/startupModel');

exports.getAllApplications = async (req, res) => {
  try {
    const startups = await Startup.find().select('-password');
    res.json(startups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.approveRejectStartup = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ msg: 'Startup not found' });
    }

    startup.status = status;
    if (status === 'rejected') {
      startup.rejectionReason = rejectionReason;
    } else {
      startup.rejectionReason = null;
    }

    await startup.save();

    res.json(startup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};