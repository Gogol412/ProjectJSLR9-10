class MetalProduct {
    constructor({ id, name, type, weight, purity, pricePerKg, productionDate, factory, alloys }) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.weight = weight;
        this.purity = purity;
        this.pricePerKg = pricePerKg;
        this.productionDate = productionDate;
        this.factory = factory;
        this.alloys = alloys;
    }

    static create(data) {
        return new MetalProduct({
            id: 'metal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: data.name || 'Unknown',
            type: data.type || 'steel',
            weight: data.weight || 1000,
            purity: data.purity || 99.5,
            pricePerKg: data.pricePerKg || 50,
            productionDate: new Date().toISOString(),
            factory: data.factory || 'Unknown Factory',
            alloys: data.alloys || {}
        });
    }

    static createSteel(name) {
        return new MetalProduct({
            id: 'metal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Steel',
            type: 'steel',
            weight: 1000,
            purity: 99.5,
            pricePerKg: 50,
            productionDate: new Date().toISOString(),
            factory: 'Steelworks',
            alloys: {}
        });
    }

    static createAluminum(name) {
        return new MetalProduct({
            id: 'metal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Aluminum',
            type: 'aluminum',
            weight: 500,
            purity: 99.7,
            pricePerKg: 150,
            productionDate: new Date().toISOString(),
            factory: 'Aluminum Plant',
            alloys: {}
        });
    }

    static createCopper(name) {
        return new MetalProduct({
            id: 'metal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Copper',
            type: 'copper',
            weight: 300,
            purity: 99.9,
            pricePerKg: 300,
            productionDate: new Date().toISOString(),
            factory: 'Copper Refinery',
            alloys: {}
        });
    }

    static createGold(name) {
        return new MetalProduct({
            id: 'metal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Gold',
            type: 'gold',
            weight: 1,
            purity: 99.99,
            pricePerKg: 65000000,
            productionDate: new Date().toISOString(),
            factory: 'Gold Reserve',
            alloys: {}
        });
    }

    static createSilver(name) {
        return new MetalProduct({
            id: 'metal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name || 'Silver',
            type: 'silver',
            weight: 1,
            purity: 99.9,
            pricePerKg: 850000,
            productionDate: new Date().toISOString(),
            factory: 'Silver Mint',
            alloys: {}
        });
    }
}

module.exports = MetalProduct;