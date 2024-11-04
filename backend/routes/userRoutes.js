const express = require('express')
const users = require('../models/userModel')

const router = express.Router()

router.get('/', async (req,res) => {
    try {
        const userss = await users.find();
        res.json(userss)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.get('/:id', async (req,res) => {
    const id = req.params.id;
    try {
        const user = await users.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.put('/:id',async (req,res) => {
    try {
        const updated = await users.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(updated)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.delete(':/id', async (req, res) => {
    try {
        const deleted = await users.findByIdAndDelete(req.params.id);
        res.json("user deleted")
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router;