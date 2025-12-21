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
            id: 'metal-' + Date.now(),
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
}

module.exports = MetalProduct;