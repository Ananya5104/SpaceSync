const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Owner = require('../models/ownerModel');

const router = express.Router();
const JWT_SECRET = 'spaceSync_ka_secret';  

// Utility function to dynamically select the model based on role
const getModel = (role) => {
    switch (role) {
        case 'owner':
            return Owner;
        case 'user':
            return User;
        default:
            throw new Error('Invalid role');
    }
};

router.post('/signup', async (req, res) => {
    const { name, email, password, role, phno } = req.body;

    try {
        if (!name || !email || !password || !role || !phno) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        if (!['user', 'owner'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role specified' });
        }
        const Model = getModel(role);

        let existingUser = await Model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newUser = new Model({
            name,
            email,
            password,
            phno
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

        const payload = { id: newUser._id, role: newUser.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, msg: `${role} registered successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const user = await User.findOne({ email }) || await Owner.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, msg: `${user.role} logged in successfully`, role: user.role }); // Include role in response
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
