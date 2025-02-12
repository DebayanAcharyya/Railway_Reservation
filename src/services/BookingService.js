const BookingRepository = require('../repositories/BookingRepository');

class BookingService {
    async getAvailableSeats(trainId) {
        return await BookingRepository.getAvailableSeats(trainId);
    }

    async bookSeat(userId, trainId) {
        return await BookingRepository.bookSeat(userId, trainId);
    }
}

module.exports = new BookingService();
