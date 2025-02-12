const TrainRepository = require('../repositories/TrainRepository');

class TrainService {
    async createTrain(name, source, destination, totalSeats) {
        const newTrain = await TrainRepository.createTrain({
            name,
            source,
            destination,
            totalSeats,
            availableSeats: totalSeats
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
        return await TrainRepository.getTrainsByRoute(source, destination);
    }
}

module.exports = new TrainService();
