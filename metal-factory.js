class MetalProduct {
    constructor(name, type, weight, purity, pricePerKg) {
        this.id = 'metal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.type = type;
        this.weight = weight;
        this.purity = purity;
        this.pricePerKg = pricePerKg;
        this.productionDate = new Date();
    }
}

class MetallurgyFactory {
    static createSteel(name) {
        return new MetalProduct(name, "steel", 1000, 99.5, 50);
    }

    static createAluminum(name) {
        return new MetalProduct(name, "aluminum", 500, 99.7, 150);
    }

    static createCopper(name) {
        return new MetalProduct(name, "copper", 300, 99.9, 300);
    }

    static createGold(name) {
        // Исправлена цена золота на более реалистичную
        return new MetalProduct(name, "gold", 1, 99.99, 65000000);
    }

    static createSilver(name) {
        return new MetalProduct(name, "silver", 1, 99.9, 850000);
    }
}

module.exports = { MetallurgyFactory, MetalProduct };