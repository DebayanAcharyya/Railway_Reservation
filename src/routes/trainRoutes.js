const express = require('express');
const TrainController = require('../controllers/TrainController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// Create Train (Admin)
router.post('/add', authMiddleware, adminMiddleware, TrainController.createTrain);

// Fetch All Trains
router.get('/', TrainController.getAllTrains);

// Get Train By Id
router.get('/:id', TrainController.getTrainById)

// Get Trains By Source And Destination
router.get('/search', TrainController.getTrainsByRoute);

module.exports = router;
