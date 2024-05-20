const express = require('express');
const Laptop = require('../models/laptops');
const middleware = require("../middleware/middleware");

const router = express.Router();

// Middleware to check login and admin status
const checkSession = async (req, res, next) => {
    req.session.isLoggedIn = await middleware.isLoggedIn(req);
    req.session.isAdmin = await middleware.isAdmin(req);
    next();
};

// Get all laptops
router.get('/laptops', checkSession, async (req, res) => {
    try {
        const laptops = await Laptop.find();
        res.json({ 
            laptops,
            isLoggedIn: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single laptop by ID
router.get('/laptops/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const laptop = await Laptop.findById(id);
        if (!laptop) {
            return res.status(404).json({ message: "Laptop not found" });
        }
        res.json(laptop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new laptop
router.post('/laptops', checkSession, async (req, res) => {
    try {
        const {
            imgUrl,
            name,
            price,
            processor,
            ram,
            graphics_memory,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        } = req.body;

        const laptop = await Laptop.create({
            imgUrl,
            name,
            price,
            processor,
            ram,
            graphics_memory,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        });

        res.status(201).json(laptop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a laptop by ID
router.put('/laptops/:id', checkSession, async (req, res) => {
    try {
        const {
            imgUrl,
            name,
            price,
            processor,
            ram,
            graphics_memory,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        } = req.body;

        const laptopId = req.params.id;

        const updatedLaptop = await Laptop.findByIdAndUpdate(laptopId, {
            imgUrl,
            name,
            price,
            processor,
            ram,
            graphics_memory,
            operating_system,
            height,
            width,
            depth,
            weight,
            included_accessories
        }, { new: true });

        if (!updatedLaptop) {
            return res.status(404).json({ message: "Laptop not found" });
        }

        res.json(updatedLaptop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a laptop by ID
router.delete('/laptops/:id', checkSession, async (req, res) => {
    try {
        const laptopId = req.params.id;
        const deletedLaptop = await Laptop.findByIdAndDelete(laptopId);
        if (!deletedLaptop) {
            return res.status(404).json({ message: "Laptop not found" });
        }
        res.json({ message: "Laptop deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
