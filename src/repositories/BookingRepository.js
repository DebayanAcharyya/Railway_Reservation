const prisma = require("../config/db");

class BookingRepository {
    async getAvailableSeats(trainId) {
        const train = await prisma.train.findUnique({
            where: { id: trainId },
            include: { bookings: true },
        });

        if (!train) return null;

        const bookedSeats = train.bookings.map((b) => b.seatNo);
        return Array.from({ length: train.totalSeats }, (_, i) => i + 1)
                    .filter((seat) => !bookedSeats.includes(seat));
    }


    async bookSeat(userId, trainId) {
        return await prisma.$transaction(async (tx) => {
            const train = await tx.train.findUnique({
                where: { id: trainId },
                include: { bookings: true },
            });

            if (!train) throw new Error("Train not found");
            if (train.bookings.length >= train.totalSeats) throw new Error("No available seats");

            const bookedSeats = train.bookings.map((b) => b.seatNo);
            const availableSeats = Array.from({ length: train.totalSeats }, (_, i) => i + 1)
                                       .filter((seat) => !bookedSeats.includes(seat));

            if (availableSeats.length === 0) throw new Error("No available seats");

            // Book first available seat
            const seatNo = availableSeats[0];
            return await tx.booking.create({
                data: { userId, trainId, seatNo },
            });
        });
    }

    async getBookingById(bookingId) {
        return await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                User: { select: { name: true, email: true } }, // Include user details
                Train: { select: { name: true, source: true, destination: true } } // Include train details
            }
        });
    }
}

module.exports = new BookingRepository();