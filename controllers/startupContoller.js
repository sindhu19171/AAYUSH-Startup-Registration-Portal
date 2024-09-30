const Startup = require('../models/startupModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure AWS
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});

exports.registerStartup = async (req, res) => {
  try {
    upload.array('documents', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: 'File upload error', error: err.message });
      }

      const { email, password, name, ayushCategory, owner, description } = req.body;

      let startup = await Startup.findOne({ email });
      if (startup) {
        return res.status(400).json({ msg: 'Startup with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const documents = req.files.map(file => ({
        name: file.originalname,
        url: file.location
      }));

      startup = new Startup({
        email,
        password: hashedPassword,
        name,
        ayushCategory,
        owner,
        description,
        documents,
        submissionHistory: [{
          documents,
          status: 'pending',
          submittedAt: new Date()
        }]
      });

      await startup.save();

      const payload = { user: { id: startup.id, role: 'startup' } };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getStartupStatus = async (req, res) => {
  try {
    const startup = await Startup.findById(req.user.id).select('-password');
    if (!startup) {
      return res.status(404).json({ msg: 'Startup not found' });
    }
    res.json(startup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateStartup = async (req, res) => {
  try {
    upload.array('documents', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: 'File upload error', error: err.message });
      }

      const { name, ayushCategory, owner, description } = req.body;

      const startup = await Startup.findById(req.user.id);
      if (!startup) {
        return res.status(404).json({ msg: 'Startup not found' });
      }

      if (startup.status === 'rejected') {
        const documents = req.files.map(file => ({
          name: file.originalname,
          url: file.location
        }));

        startup.submissionHistory.push({
          documents,
          status: 'pending',
          submittedAt: new Date()
        });

        startup.status = 'pending';
        startup.rejectionReason = null;
      }

      startup.name = name || startup.name;
      startup.ayushCategory = ayushCategory || startup.ayushCategory;
      startup.owner = owner || startup.owner;
      startup.description = description || startup.description;

      if (req.files && req.files.length > 0) {
        const newDocuments = req.files.map(file => ({
          name: file.originalname,
          url: file.location
        }));
        startup.documents = [...startup.documents, ...newDocuments];
      }

      await startup.save();

      res.json(startup);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find({ status: 'approved' }).select('-password -documents');
    res.json(startups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getStartupDetails = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).select('-password');
    if (!startup) {
      return res.status(404).json({ msg: 'Startup not found' });
    }
    if (startup.status !== 'approved') {
      return res.status(403).json({ msg: 'Startup details are not available' });
    }
    res.json(startup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};