module.exports = function(MetalProduct) {
    MetalProduct.prototype.calculateTotalPrice = function() {
        return this.weight * this.pricePerKg;
    };

    MetalProduct.prototype.setWeight = function(newWeight) {
        if (newWeight <= 0) {
            throw new Error('Weight must be positive');
        }
        this.weight = newWeight;
        return this;
    };

    MetalProduct.prototype.updatePurity = function(newPurity) {
        if (newPurity < 0 || newPurity > 100) {
            throw new Error('Purity must be between 0 and 100%');
        }
        this.purity = newPurity;
        return this;
    };

    MetalProduct.prototype.changePricePerKg = function(newPrice) {
        if (newPrice < 0) {
            throw new Error('Price cannot be negative');
        }
        this.pricePerKg = newPrice;
        return this;
    };

    MetalProduct.prototype.getInfo = function() {
    
        const productionDate = this._getDateObject(this.productionDate);
        
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            weight: this.weight.toFixed(2) + ' kg',
            purity: this.purity.toFixed(2) + '%',
            pricePerKg: this.pricePerKg.toLocaleString('ru-RU') + ' RUB/kg',
            totalPrice: this.calculateTotalPrice().toLocaleString('ru-RU') + ' RUB',
            productionDate: productionDate.toISOString(),
            quality: this.getQuality(),
            isPrecious: this.isPrecious(),
            volume: this.calculateVolume().toFixed(4) + ' m³'
        };
    };

    MetalProduct.prototype.isPrecious = function() {
        const preciousTypes = ['gold', 'silver', 'platinum', 'palladium'];
        return preciousTypes.includes(this.type);
    };

    MetalProduct.prototype.getQuality = function() {
        const purity = this.purity;
        
        if (this.isPrecious()) {
            if (purity >= 99.99) return 'Investment Grade';
            if (purity >= 99.9) return 'High Purity';
            if (purity >= 99.5) return 'Commercial';
            return 'Low Purity';
        } else {
            if (purity >= 99.9) return 'Premium';
            if (purity >= 99.5) return 'High';
            if (purity >= 99.0) return 'Standard';
            if (purity >= 98.0) return 'Commercial';
            return 'Industrial';
        }
    };

    MetalProduct.prototype.addAlloy = function(element, percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new Error('Percentage must be between 0 and 100');
        }
        
        if (!this.alloys) this.alloys = {};
        this.alloys[element] = percentage;
        return this;
    };

    MetalProduct.prototype.calculateFinalPurity = function() {
        if (!this.alloys || Object.keys(this.alloys).length === 0) {
            return this.purity;
        }
        
        const totalAlloyPercentage = Object.values(this.alloys)
            .reduce((sum, perc) => sum + perc, 0);
        
        const finalPurity = Math.max(0, this.purity - totalAlloyPercentage);
        return finalPurity;
    };

    MetalProduct.prototype.getDensity = function() {
        const densities = {
            'steel': 7850,       
            'aluminum': 2700,
            'copper': 8960,
            'gold': 19300,
            'silver': 10500,
            'brass': 8500,
            'bronze': 8800,
            'titanium': 4500
        };
        return densities[this.type] || densities['steel']; 
    };

    MetalProduct.prototype.calculateVolume = function() {
        const density = this.getDensity();
        if (density === 0) return 0;
        return this.weight / density; 
    };

    MetalProduct.prototype.calculateDensity = function() {
        return this.getDensity();
    };

    MetalProduct.prototype.getAgeInDays = function() {
        const productionDate = this._getDateObject(this.productionDate);
        const now = new Date();
        const diff = now - productionDate;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    MetalProduct.prototype.getAge = function() {
        return this.getAgeInDays();
    };
    MetalProduct.prototype._getDateObject = function(date) {
        if (date instanceof Date) {
            return date;
        } else if (typeof date === 'string' || typeof date === 'number') {
            return new Date(date);
        } else {
            return new Date(); 
        }
    };
};