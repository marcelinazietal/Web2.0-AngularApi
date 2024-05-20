const express = require('express');
const JWT = require('jwt-async');
const router = express.Router();
const computersController = require('../controllers/computersController');
const laptopsController = require('../controllers/laptopsController');
const userController = require('../controllers/usersController');
const Computer = require('../models/computers');
const Laptop = require('../models/laptops');

// żądania z użytkownikami
router.post('/login', (req,res) => userController.login(req,res))
router.get('/logout', (req,res) => userController.logout(req,res))
router.post('/register', (req,res) => userController.createUser(req,res))
router.get('/activate/:token', (req,res) => userController.activateUser(req,res))
router.post('/changepassword', (req,res) => userController.changepassword(req,res))
router.get('/users',  (req,res) => userController.adminPanel(req,res))
router.post('/createuser',  (req,res) => userController.createUserByAdmin(req,res))
router.post('/deleteuser/:id',  (req,res) => userController.deleteUser(req,res))
router.post('/changeprivileges/:id',  (req,res) => userController.changePrivileges(req,res))

// żądania z komputerami
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

// żądania z laptopami
// Get all laptops
router.get('/laptops', async (req, res) => {
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
router.post('/laptops', async (req, res) => {
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
router.put('/laptops/:id', async (req, res) => {
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
router.delete('/laptops/:id', async (req, res) => {
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