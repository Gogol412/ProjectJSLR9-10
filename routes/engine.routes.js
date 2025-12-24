const fs = require('fs');
const path = require('path');
const Engine = require('../models/Engine');

const DATA_PATH = path.join(__dirname, '../data/engines.json');

function readEngines() {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
}

function writeEngines(engines) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(engines, null, 2));
}

module.exports = (app) => {

    app.get('/engines', (req, res) => {
        const engines = readEngines();
        res.json(engines);
    });
    app.get('/engines/:id', (req, res) => {
        const engines = readEngines();
        const id = Number(req.params.id);

        const engine = engines.find(e => e.id === id);

        if (!engine) {
            return res.status(404).json({ message: 'Engine not found' });
        }

        res.json(engine);
    });
    app.post('/engines', (req, res) => {
        const engines = readEngines();

        const newEngine = Engine.create(req.body);
        engines.push(newEngine);

        writeEngines(engines);

        res.status(201).json(newEngine);
    });
    app.put('/engines/:id', (req, res) => {
        const engines = readEngines();
        const id = Number(req.params.id);

        const index = engines.findIndex(e => e.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Engine not found' });
        }
        const engine = new Engine(engines[index]);
        engine.update(req.body);

        engines[index] = engine;
        writeEngines(engines);

        res.json(engine);
    });
    app.patch('/engines/:id', (req, res) => {
        const engines = readEngines();
        const id = Number(req.params.id);

        const index = engines.findIndex(e => e.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Engine not found' });
        }
        const engine = new Engine(engines[index]);
        engine.patch(req.body);

        engines[index] = engine;
        writeEngines(engines);

        res.json(engine);
    });
    app.delete('/engines/:id', (req, res) => {
        const engines = readEngines();
        const id = Number(req.params.id);

        const newEngines = engines.filter(e => e.id !== id);

        if (newEngines.length === engines.length) {
            return res.status(404).json({ message: 'Engine not found' });
        }

        writeEngines(newEngines);

        res.json({ message: 'Engine deleted' });
    });

};