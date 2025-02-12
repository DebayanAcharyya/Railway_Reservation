const express = require('express');
const BookingController = require('../controllers/BookingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, BookingController.bookSeat);
router.get('/:trainId/seats', BookingController.getAvailableSeats);




module.exports = router;
