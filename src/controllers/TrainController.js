const TrainService = require('../services/TrainService');

class TrainController {
    async createTrain(req, res) {
        try {
            const { name, source, destination, totalSeats } = req.body;
            if (!name || !source || !destination || !totalSeats) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const train = await TrainService.createTrain(name, source, destination, totalSeats);
            res.status(201).json({ message: "Train added successfully", train });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllTrains(req, res) {
        try {
            const trains = await TrainService.getAllTrains();
            res.status(200).json(trains);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTrainById(req, res) {
        try {
            const train = await TrainService.getTrainById(req.params.id);
            res.status(200).json(train);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getTrainsByRoute(req, res) {
        try {
            const { source, destination } = req.query;
            if (!source || !destination) {
                return res.status(400).json({ error: "Source and destination are required" });
            }

            const trains = await TrainService.getTrainsByRoute(source, destination);
            
            res.status(200).json(trains);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TrainController();
