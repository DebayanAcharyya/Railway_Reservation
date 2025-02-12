const BookingRepository = require('../repositories/BookingRepository');

class BookingService {
    async getAvailableSeats(trainId) {
        return await BookingRepository.getAvailableSeats(trainId);
    }

    async bookSeat(userId, trainId) {
        return await BookingRepository.bookSeat(userId, trainId);
    }
    async getBookingById(bookingId) {
        const booking = await BookingRepository.getBookingById(bookingId);
        if (!booking) throw new Error("Booking not found");
        return booking;
    }
}

module.exports = new BookingService();
