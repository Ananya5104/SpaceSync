const express = require('express')
const Workspace = require('../models/workspaceModel')
const multer = require('multer')
const path = require('path')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('public', 'workSpaceImages'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Save a new package with image upload handling
router.post('/', upload.array('images'), async (req, res) => {
    try {
        const { name, location, address, owner, capacity, pricing, description, amenities } = req.body;

        if (!name || !location || !address || !owner || !capacity || !pricing) {
            return res.status(400).send({
                message: 'Please provide all required fields: name, location, address, owner, capacity, pricing',
            });
        }
        console.log(req.files); // Logs the uploaded files

        const imagePaths = req.files ? req.files.map(file => `/workspaceImages/${file.filename}`) : [];

        const amenitiesArray = amenities ? amenities.split(',').map(item => item.trim()) : [];
        const newWorkspace = {
            name,
            location,
            address,
            owner,
            capacity,
            pricing,
            description,
            amenities: amenitiesArray,
            images: imagePaths,
        };

        const workspace = await Workspace.create(newWorkspace);
        return res.status(201).send(workspace);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
// Get all workspaces
router.get('/', async (req, res) => {
  try {
    const workspaces = await Workspace.find({});
    return res.status(200).json({
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get details of a single workspace by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workspace = await Workspace.findOne({ _id: id });

    if (!workspace) {
      return res.status(404).send({ message: 'Workspace not found' });
    }

    return res.status(200).json(workspace);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Update a workspace
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, address, owner, capacity, pricing, description, amenities, image } = req.body;

    if (!name || !location || !address || !owner || !capacity || !pricing) {
      return res.status(400).send({
        message: 'Please provide all required fields: name, location, address, owner, capacity, pricing',
      });
    }

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      id,
      { name, location, address, owner, capacity, pricing, description, amenities, image },
      { new: true }
    );

    if (!updatedWorkspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    return res.status(200).json({ message: 'Workspace updated successfully', data: updatedWorkspace });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Delete a workspace
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Workspace.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    return res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.get('/owner/:ownerId', async (req, res) => {
    const { ownerId } = req.params; // Extract ownerId from route parameters

    try {
        // Find workspaces associated with the ownerId
        const workspaces = await Workspace.find({ owner: ownerId }); // Adjust according to your schema

        if (!workspaces.length) {
            return res.status(404).json({ message: 'No workspaces found for this owner.' });
        }

        // Return the workspaces in the response
        res.status(200).json(workspaces);
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;