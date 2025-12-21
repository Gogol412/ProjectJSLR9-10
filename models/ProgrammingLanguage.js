class ProgrammingLanguage {
    constructor({ id, name, year, isOOP, createdAt, popularPatterns }) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.isOOP = isOOP;
        this.createdAt = createdAt;
        this.popularPatterns = popularPatterns;
    }

    static create(data) {
        return new ProgrammingLanguage({
            id: Date.now(),
            name: data.name || 'Unknown',
            year: data.year || 0,
            isOOP: Boolean(data.isOOP),
            createdAt: new Date().toISOString(),
            popularPatterns: data.popularPatterns || []
        });
    }
}

module.exports = ProgrammingLanguage;