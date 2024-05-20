const express = require('express');
const router = express.Router();
const Computer = require('../models/computers');

// Get all computers
router.get('/computers', async (req, res) => {
    try {
        const computers = await Computer.find();
        res.json(computers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get computer by ID
router.get('/computers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const computer = await Computer.findById(id);
        if (!computer) {
            return res.status(404).json({ message: "Computer not found" });
        }
        res.json(computer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new computer
router.post('/computers', async (req, res) => {
    try {
        const {
            imgUrl,
            name,
            price,
            processor,
            ram,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        } = req.body;

        const computer = new Computer({
            imgUrl,
            name,
            price,
            processor,
            ram,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        });

        await computer.save();
        res.status(201).json(computer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a computer by ID
router.put('/computers/:id', async (req, res) => {
    try {
        const {
            imgUrl,
            name,
            price,
            processor,
            ram,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        } = req.body;

        const { id } = req.params;

        const updatedComputer = await Computer.findByIdAndUpdate(id, {
            imgUrl,
            name,
            price,
            processor,
            ram,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        }, { new: true });

        if (!updatedComputer) {
            return res.status(404).json({ message: "Computer not found" });
        }

        res.json(updatedComputer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a computer by ID
router.delete('/computers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComputer = await Computer.findByIdAndDelete(id);

        if (!deletedComputer) {
            return res.status(404).json({ message: "Computer not found" });
        }

        res.json({ message: "Computer deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
