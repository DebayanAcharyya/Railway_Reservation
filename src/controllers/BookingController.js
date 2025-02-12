const BookingService = require('../services/BookingService');

class BookingController {
    
    async getAvailableSeats(req, res) {
        try {
            const trainId = Number(req.params.trainId);
            if (isNaN(trainId)) return res.status(400).json({ error: "Invalid train ID" });

            const availableSeats = await BookingService.getAvailableSeats(trainId);
            res.status(200).json({ availableSeats });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    
    async bookSeat(req, res) {
        try {
            const { trainId } = req.body;
            const userId = req.user.id;

            if (!trainId) {
                return res.status(400).json({ error: "Train ID is required" });
            }

            const booking = await BookingService.bookSeat(userId, trainId);
            res.status(201).json({ message: "Seat booked successfully", booking });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new BookingController();
