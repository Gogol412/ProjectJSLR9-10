class AlcoholProduct {
    constructor({ id, name, type, volume, strength, price, productionDate, aging, factory }) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.volume = volume;
        this.strength = strength;
        this.price = price;
        this.productionDate = productionDate;
        this.aging = aging;
        this.factory = factory;
    }

    static create(data) {
        return new AlcoholProduct({
            id: 'alc-' + Date.now(),
            name: data.name || 'Unknown',
            type: data.type || 'vodka',
            volume: data.volume || 0.7,
            strength: data.strength || 40,
            price: data.price || 500,
            productionDate: new Date().toISOString(),
            aging: data.aging || 0,
            factory: data.factory || 'Unknown Factory'
        });
    }
}

module.exports = AlcoholProduct;