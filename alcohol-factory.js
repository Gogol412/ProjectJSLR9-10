class AlcoholProduct {
    constructor(name, type, volume, strength, price) {
        this.id = 'alc-' + Date.now();
        this.name = name;
        this.type = type;
        this.volume = volume;
        this.strength = strength;
        this.price = price;
        this.productionDate = new Date();
    }
}

class AlcoholFactory {
    static createVodka(name) {
        return new AlcoholProduct(name, "vodka", 0.7, 40, 500);
    }

    static createWhiskey(name) {
        return new AlcoholProduct(name, "whiskey", 0.7, 43, 1500);
    }

    static createBeer(name) {
        return new AlcoholProduct(name, "beer", 0.5, 5, 150);
    }

    static createWine(name) {
        return new AlcoholProduct(name, "wine", 0.75, 12, 800);
    }
}

module.exports = { AlcoholFactory, AlcoholProduct };