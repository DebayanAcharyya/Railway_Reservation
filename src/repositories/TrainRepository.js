const prisma = require('../config/db');

class TrainRepository {
    async createTrain(trainData) {
        return await prisma.train.create({ data: trainData });
    }

    async getAllTrains() {
        return await prisma.train.findMany();
    }

    async getTrainById(id) {
        return await prisma.train.findUnique({ where: { id: Number(id) } });
    }

    async getTrainsByRoute(source, destination) {
        return await prisma.train.findMany({
            where: {
                source: source,
                destination: destination
            }
        });
    }
}

module.exports = new TrainRepository();
