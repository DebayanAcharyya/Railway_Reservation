const BookingService = require('../services/BookingService');

class BookingController {
    
    async getAvailableSeats(req, res) {
        try {
            const { trainId } = req.params;
            const availableSeats = await BookingService.getAvailableSeats(parseInt(trainId));
            
            if (availableSeats === null) {
                return res.status(404).json({ error: "Train not found" });
            }

            res.status(200).json({ trainId, availableSeats });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    
    async bookSeat(req, res) {
        try {
            const { trainId } = req.body;
            //const userId = req.user.id;
            console.log("Decoded User:", req.user);
            const userId = req.user?.userId;  // Ensure userId is extracted from JWT

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized: User ID missing" });
            }

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
