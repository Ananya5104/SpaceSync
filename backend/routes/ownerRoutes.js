// routes/owners.js
const express = require('express');
const Owner = require('../models/ownerModel');
const bcrypt = require('bcrypt')
const router = express.Router();

// Create a new owner
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const newOwner = new Owner({ name, email,phno, password }); // Password should be hashed
  try {
    await newOwner.save();
    res.status(201).json(newOwner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read all owners
router.get('/', async (req, res) => {
  try {
    const owners = await Owner.find();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read a single owner by ID
router.get('/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an owner
router.put('/:id', async (req, res) => {
  try {
    const updatedOwner = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOwner) return res.status(404).json({ message: 'Owner not found' });
    res.json(updatedOwner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an owner
router.delete('/:id', async (req, res) => {
  try {
    const deletedOwner = await Owner.findByIdAndDelete(req.params.id);
    if (!deletedOwner) return res.status(404).json({ message: 'Owner not found' });
    res.json({ message: 'Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id/update-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
      // Find the ownerr by ID
      const ownerr = await Owner.findById(id);
      if (!ownerr) {
          return res.status(404).json({ error: 'ownerr not found' });
      }

      // Check if the current password matches
      const isMatch = await bcrypt.compare(currentPassword, ownerr.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Incorrect current password' });
      }

      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      ownerr.password = hashedPassword;
      await ownerr.save();

      res.json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

  module.exports = router;