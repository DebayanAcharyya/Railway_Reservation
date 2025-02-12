const express = require('express');
const BookingController = require('../controllers/BookingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/book', authMiddleware, BookingController.bookSeat);
router.get('/available-seats/:trainId', BookingController.getAvailableSeats); // Protected Route
router.get("/:bookingId", authMiddleware, BookingController.getBookingById); // Protected Route

module.exports = router;
