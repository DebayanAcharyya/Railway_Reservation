const TrainRepository = require('../repositories/TrainRepository');

class TrainService {
    async createTrain(name, source, destination, totalSeats) {
        const newTrain = await TrainRepository.createTrain({
            name,
            source,
            destination,
            totalSeats
        });
        return newTrain;
    }

    async getAllTrains() {
        return await TrainRepository.getAllTrains();
    }

    async getTrainById(id) {
        const train = await TrainRepository.getTrainById(id);
        if (!train) throw new Error("Train not found");
        return train;
    }

   
    async getTrainsByRoute(source, destination) {
        const trains =  await TrainRepository.getTrainsByRoute(source.trim(), destination.trim());

        return trains.map((train) => {
            const bookedSeats = train.bookings.length;
            return {
                id: train.id,
                name: train.name,
                source: train.source,
                destination: train.destination,
                totalSeats: train.totalSeats,
                availableSeats: train.totalSeats - bookedSeats
            };
        });
    }

}

module.exports = new TrainService();
