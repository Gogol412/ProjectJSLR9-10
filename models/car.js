class Car {
    constructor({ id, brand, model, year, isElectric, createdAt, features }) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.isElectric = isElectric;
        this.createdAt = createdAt;
        this.features = features;
    }

    static create(data) {
        return new Car({
            id: Date.now(),
            brand: data.brand || 'Unknown',
            model: data.model || 'Unknown',
            year: data.year || new Date().getFullYear(),
            isElectric: Boolean(data.isElectric),
            createdAt: new Date().toISOString(),
            features: data.features || []
        });
    }
}

module.exports = Car;