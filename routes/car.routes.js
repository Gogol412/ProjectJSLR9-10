const fs = require('fs');
const path = require('path');
const Car = require('../models/car');

const DATA_PATH = path.join(__dirname, '../data/car.json');

function readCar() {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        return [];
    }
}

function writeCar(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = app => {
    app.get('/car', (req, res) => {
        res.json(readCar());
    });
    app.post('/car', (req, res) => {
        const cars = readCar();
        const car = Car.create(req.body);
        cars.push(car);
        writeCar(cars);
        res.status(201).json(car);
    });
    app.get('/car/:id', (req, res) => {
        const cars = readCar();
        const car = cars.find(
            c => c.id === Number(req.params.id)
        );

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.json(car);
    });
    app.put('/car/:id', (req, res) => {
        const cars = readCar();
        const index = cars.findIndex(
            c => c.id === Number(req.params.id)
        );

        if (index === -1) {
            return res.status(404).json({ message: 'Car not found' });
        }

        cars[index] = {
            id: cars[index].id,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            isElectric: req.body.isElectric,
            createdAt: cars[index].createdAt, 
            features: req.body.features
        };

        writeCar(cars);
        res.json(cars[index]);
    });
    app.patch('/car/:id', (req, res) => {
        const cars = readCar();
        const car = cars.find(
            c => c.id === Number(req.params.id)
        );

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        if (req.body.brand) car.brand = req.body.brand;
        if (req.body.model) car.model = req.body.model;
        if (req.body.year) car.year = req.body.year; 
        
        if (typeof req.body.isElectric === 'boolean') {
            car.isElectric = req.body.isElectric;
        }
        if (req.body.features) {
            car.features.push(...req.body.features);
        }
        writeCar(cars);
        res.json(car);
    });
    app.delete('/car/:id', (req, res) => {
        const cars = readCar();
        const index = cars.findIndex(
            c => c.id === Number(req.params.id)
        );

        if (index === -1) {
            return res.status(404).json({ message: 'Car not found' });
        }
        const deleted = cars.splice(index, 1);
        writeCar(cars);

        res.json(deleted[0]);
    });

};