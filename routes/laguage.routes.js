const fs = require('fs');
const path = require('path');
const ProgrammingLanguage = require('../models/ProgrammingLanguage');

const DATA_PATH = path.join(__dirname, '../data/languages.json');

function readLanguages() {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return data ? JSON.parse(data) : [];
}

function writeLanguages(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = app => {

    app.get('/languages', (req, res) => {
        res.json(readLanguages());
    });

    app.post('/languages', (req, res) => {
        const languages = readLanguages();
        const language = ProgrammingLanguage.create(req.body);
        languages.push(language);
        writeLanguages(languages);
        res.status(201).json(language);
    });

    app.get('/languages/:id', (req, res) => {
        const languages = readLanguages();
        const language = languages.find(
            l => l.id === Number(req.params.id)
        );

        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        res.json(language);
    });

    app.put('/languages/:id', (req, res) => {
        const languages = readLanguages();
        const index = languages.findIndex(
            l => l.id === Number(req.params.id)
        );

        if (index === -1) {
            return res.status(404).json({ message: 'Language not found' });
        }

        languages[index] = {
            id: languages[index].id, // id сохраняем
            name: req.body.name,
            year: req.body.year,
            isOOP: req.body.isOOP,
            createdAt: languages[index].createdAt,
            popularPatterns: req.body.popularPatterns
        };

        writeLanguages(languages);
        res.json(languages[index]);
    });

    app.patch('/languages/:id', (req, res) => {
        const languages = readLanguages();
        const language = languages.find(
            l => l.id === Number(req.params.id)
        );

        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        if (req.body.name) language.name = req.body.name;
        if (req.body.year) language.year += req.body.year;
        if (typeof req.body.isOOP === 'boolean') {
            language.isOOP = req.body.isOOP;
        }
        if (req.body.popularPatterns) {
            language.popularPatterns.push(...req.body.popularPatterns);
        }

        writeLanguages(languages);
        res.json(language);
    });

    app.delete('/languages/:id', (req, res) => {
        const languages = readLanguages();
        const index = languages.findIndex(
            l => l.id === Number(req.params.id)
        );

        if (index === -1) {
            return res.status(404).json({ message: 'Language not found' });
        }

        const deleted = languages.splice(index, 1);
        writeLanguages(languages);

        res.json(deleted[0]);
    });

};
