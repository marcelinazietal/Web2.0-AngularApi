const express = require('express');
const JWT = require('jwt-async');
const router = express.Router();
const computersController = require('../controllers/computersController');
const laptopsController = require('../controllers/laptopsController');
const userController = require('../controllers/usersController');

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
router.get('/computers', (req,res) => computersController.getAllComputers(req,res))
router.get('/computers/edit/:id',  (req,res) => computersController.editComputer(req,res))
router.post('/computers/save/:id',  (req,res) => computersController.updateComputerAndShowAll(req,res))
router.get('/computers/delete/:id',  (req,res) => computersController.deleteComputerAndShowAll(req,res))
router.get('/computers/:id', (req,res) => computersController.getComputerById(req,res))
router.post('/computer',  (req,res) => computersController.createComputer(req,res))
router.put('/computers/:id',  (req,res) => computersController.updateComputer(req,res))
router.delete('/computers/:id',  (req,res) => computersController.deleteComputer(req,res))

// żądania z laptopami
router.get('/laptops', (req,res) => laptopsController.getAllLaptops(req,res))
router.get('/laptops/edit/:id',  (req,res) => laptopsController.editLaptop(req,res))
router.post('/laptops/save/:id',  (req,res) => laptopsController.updateLaptopAndShowAll(req,res))
router.get('/laptops/delete/:id',  (req,res) => laptopsController.deleteLaptopAndShowAll(req,res))
router.get('/laptops/:id', (req,res) => laptopsController.getLaptopById(req,res))
router.post('/laptop',  (req,res) => laptopsController.createLaptop(req,res))
router.put('/laptops/:id',  (req,res) => laptopsController.updateLaptop(req,res))
router.delete('/laptops/:id',  (req,res) => laptopsController.deleteLaptop(req,res))

module.exports = router;