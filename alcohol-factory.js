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
            id: 'alc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
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

    static createVodka(name) {
        return new AlcoholProduct({
            id: 'alc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Vodka',
            type: 'vodka',
            volume: 0.7,
            strength: 40,
            price: 500,
            productionDate: new Date().toISOString(),
            aging: 0,
            factory: 'Vodka Factory'
        });
    }

    static createWhiskey(name) {
        return new AlcoholProduct({
            id: 'alc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Whiskey',
            type: 'whiskey',
            volume: 0.7,
            strength: 43,
            price: 1500,
            productionDate: new Date().toISOString(),
            aging: 0,
            factory: 'Whiskey Distillery'
        });
    }

    static createBeer(name) {
        return new AlcoholProduct({
            id: 'alc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Beer',
            type: 'beer',
            volume: 0.5,
            strength: 5,
            price: 150,
            productionDate: new Date().toISOString(),
            aging: 0,
            factory: 'Brewery'
        });
    }

    static createWine(name) {
        return new AlcoholProduct({
            id: 'alc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Wine',
            type: 'wine',
            volume: 0.75,
            strength: 12,
            price: 800,
            productionDate: new Date().toISOString(),
            aging: 0,
            factory: 'Winery'
        });
    }
}

module.exports = AlcoholProduct;