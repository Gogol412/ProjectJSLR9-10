module.exports = function(AlcoholProduct) {
    AlcoholProduct.prototype.setPrice = function(newPrice) {
        this.price = newPrice;
        return this;
    };

    AlcoholProduct.prototype.updateStrength = function(newStrength) {
        this.strength = newStrength;
        return this;
    };

    AlcoholProduct.prototype.changeVolume = function(newVolume) {
        this.volume = newVolume;
        return this;
    };

    AlcoholProduct.prototype.getInfo = function() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            volume: this.volume + 'L',
            strength: this.strength + '%',
            price: this.price + ' RUB',
            productionDate: this.productionDate.toISOString()
        };
    };

    AlcoholProduct.prototype.calculateTotal = function(quantity) {
        return this.price * quantity;
    };

    AlcoholProduct.prototype.isStrong = function() {
        return this.strength > 35;
    };

    AlcoholProduct.prototype.getTax = function() {
        return this.price * 0.2;
    };

    AlcoholProduct.prototype.addAging = function(years) {
        this.aging = years;
        this.price *= (1 + years * 0.1);
        return this;
    };

    AlcoholProduct.prototype.getAge = function() {
    const now = new Date();
    const productionDate = typeof this.productionDate === 'string' 
        ? new Date(this.productionDate) 
        : this.productionDate;
    const diff = now - productionDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
};
};