const prisma = require('../config/db');

class BookingRepository {
    // Fetch available seats without starting a new transaction
    async getAvailableSeats(tx, trainId) { 
        const train = await tx.train.findUnique({
            where: { id: trainId },
            include: { bookings: true }
        });

        if (!train) {
            throw new Error("Train not found");
        }

        const bookedSeats = train.bookings.map(booking => booking.seatNo);
        return Array.from({ length: train.totalSeats }, (_, index) => index + 1)
                    .filter(seat => !bookedSeats.includes(seat));
    }

    // Book a seat using a single transaction
    async bookSeat(userId, trainId) {
        if (!userId || !trainId) {
            throw new Error("User ID and Train ID are required");
        }

        return await prisma.$transaction(async (tx) => {
            const train = await tx.train.findUnique({
                where: { id: trainId },
                include: { bookings: true }
            });

            if (!train) {
                throw new Error("Invalid train ID");
            }

            const bookedSeats = train.bookings.map(booking => booking.seatNo);
            const availableSeats = Array.from({ length: train.totalSeats }, (_, index) => index + 1)
                                        .filter(seat => !bookedSeats.includes(seat));

            if (availableSeats.length === 0) {
                throw new Error("No available seats on this train");
            }

            const seatNumber = availableSeats[0];

            console.log("Booking for User ID:", userId, "Train ID:", trainId, "Seat Number:", seatNumber);

            return await tx.booking.create({
                data: {
                    seatNo: seatNumber,
                    user: { connect: { id: userId } }, // ✅ Ensure user exists
                    train: { connect: { id: trainId } }
                }
            });
        });
    }
}

module.exports = new BookingRepository();
