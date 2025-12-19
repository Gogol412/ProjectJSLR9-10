const fs = require('fs');
const path = require('path');
const DesignPattern = require('../models/DesignPattern');

const DATA_PATH = path.join(__dirname, '../data/patterns.json');

function readPatterns() {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
}

function writePatterns(patterns) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(patterns, null, 2));
}
module.exports = (app) => {

    //          GET
    app.get('/patterns', (req, res) => {
        const patterns = readPatterns();
        res.json(patterns);
    });

    //          GET id
    app.get('/patterns/:id', (req, res) => {
        const patterns = readPatterns();
        const id = Number(req.params.id);

        const pattern = patterns.find(p => p.id === id);

        if (!pattern) {
            return res.status(404).json({ message: 'Pattern not found' });
        }

        res.json(pattern);
    });

    //          POST
    app.post('/patterns', (req, res) => {
        const patterns = readPatterns();

        const newPattern = DesignPattern.create(req.body);
        patterns.push(newPattern);

        writePatterns(patterns);

        res.status(201).json(newPattern);
    });

    //          PUT id
    app.put('/patterns/:id', (req, res) => {
        const patterns = readPatterns();
        const id = Number(req.params.id);

        const index = patterns.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Pattern not found' });
        }

        const pattern = new DesignPattern(patterns[index]);
        pattern.update(req.body);

        patterns[index] = pattern;
        writePatterns(patterns);

        res.json(pattern);
    });

    //             PATCH id
    app.patch('/patterns/:id', (req, res) => {
        const patterns = readPatterns();
        const id = Number(req.params.id);

        const index = patterns.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Pattern not found' });
        }

        const pattern = new DesignPattern(patterns[index]);
        pattern.patch(req.body); // НЕ идемпотентный

        patterns[index] = pattern;
        writePatterns(patterns);

        res.json(pattern);
    });

    //          DELETE id
    app.delete('/patterns/:id', (req, res) => {
        const patterns = readPatterns();
        const id = Number(req.params.id);

        const newPatterns = patterns.filter(p => p.id !== id);

        if (newPatterns.length === patterns.length) {
            return res.status(404).json({ message: 'Pattern not found' });
        }

        writePatterns(newPatterns);

        res.json({ message: 'Pattern deleted' });
    });

};