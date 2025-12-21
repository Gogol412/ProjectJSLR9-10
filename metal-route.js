const fs = require('fs');
const path = require('path');
const MetalProduct = require('./metal-factory');

const DATA_PATH = path.join(__dirname, '../data/metal-data.json');

function readMetalData() {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        const parsed = data ? JSON.parse(data) : { metalProducts: [] };
        return parsed.metalProducts || [];
    } catch (err) {
        console.error('Error reading metal data:', err);
        return [];
    }
}

function writeMetalData(metalProducts) {
    try {
        const data = {
            metalProducts: metalProducts,
            factoryInfo: {
                name: "Metallurgical Industrial Complex",
                location: "Chelyabinsk, Russia",
                established: 1932,
                certification: "ISO 9001:2015",
                productionCapacity: "500000 tons/year",
                productTypes: ["steel", "aluminum", "copper", "gold", "silver", "alloys"],
                furnaces: {
                    blastFurnaces: 3,
                    electricArcFurnaces: 2,
                    rollingMills: 5
                }
            }
        };
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing metal data:', err);
    }
}

module.exports = app => {
    app.get('/metal', (req, res) => {
        try {
            const metalProductsData = readMetalData();
            const products = metalProductsData.map(data => {
                const product = new MetalProduct(data);
                if (typeof product.getInfo === 'function') {
                    return product.getInfo();
                } else {
                    return {
                        id: product.id,
                        name: product.name,
                        type: product.type,
                        weight: product.weight + ' kg',
                        purity: product.purity + '%',
                        pricePerKg: product.pricePerKg + ' RUB/kg',
                        totalPrice: (product.weight * product.pricePerKg) + ' RUB',
                        productionDate: product.productionDate,
                        factory: product.factory || 'Unknown'
                    };
                }
            });
            res.json({
                count: products.length,
                products: products
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/metal', (req, res) => {
        try {
            const { name, type, weight, purity, pricePerKg, factory } = req.body;
            
            if (!name) {
                return res.status(400).json({ 
                    error: 'Name is required' 
                });
            }
            
            let product;
            
            if (type) {
                switch(type.toLowerCase()) {
                    case 'steel':
                        product = MetalProduct.createSteel(name);
                        break;
                    case 'aluminum':
                        product = MetalProduct.createAluminum(name);
                        break;
                    case 'copper':
                        product = MetalProduct.createCopper(name);
                        break;
                    case 'gold':
                        product = MetalProduct.createGold(name);
                        break;
                    case 'silver':
                        product = MetalProduct.createSilver(name);
                        break;
                    default:
                        product = MetalProduct.create(req.body);
                }
            } else {
                product = MetalProduct.create(req.body);
            }
            
            const updatedProduct = {
                id: product.id,
                name: product.name,
                type: product.type,
                weight: weight !== undefined ? weight : product.weight,
                purity: purity !== undefined ? purity : product.purity,
                pricePerKg: pricePerKg !== undefined ? pricePerKg : product.pricePerKg,
                productionDate: product.productionDate,
                factory: factory !== undefined ? factory : product.factory,
                alloys: product.alloys || {}
            };
            
            const metalProducts = readMetalData();
            
            metalProducts.push(updatedProduct);
            
            writeMetalData(metalProducts);
            
            const responseProduct = new MetalProduct(updatedProduct);
            res.status(201).json({
                message: 'Metal product created successfully',
                product: responseProduct
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/metal/:id', (req, res) => {
        try {
            const metalProducts = readMetalData();
            const productData = metalProducts.find(p => p.id === req.params.id);
            
            if (!productData) {
                return res.status(404).json({ 
                    error: 'Metal product not found' 
                });
            }
            
            const product = new MetalProduct(productData);
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put('/metal/:id', (req, res) => {
        try {
            const metalProducts = readMetalData();
            const index = metalProducts.findIndex(p => p.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Metal product not found' 
                });
            }
            
            const { name, type, weight, purity, pricePerKg, factory } = req.body;
            
            const originalProduct = metalProducts[index];
            
            metalProducts[index] = {
                id: originalProduct.id,
                name: name || originalProduct.name,
                type: type || originalProduct.type,
                weight: weight || originalProduct.weight,
                purity: purity || originalProduct.purity,
                pricePerKg: pricePerKg || originalProduct.pricePerKg,
                productionDate: originalProduct.productionDate,
                factory: factory || originalProduct.factory,
                alloys: originalProduct.alloys || {}
            };
            
            writeMetalData(metalProducts);
            
            const updatedProduct = new MetalProduct(metalProducts[index]);
            res.json({
                message: 'Metal product updated successfully',
                product: updatedProduct
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.patch('/metal/:id', (req, res) => {
        try {
            const metalProducts = readMetalData();
            const index = metalProducts.findIndex(p => p.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Metal product not found' 
                });
            }
            
            const productData = metalProducts[index];
            
            if (req.body.name !== undefined) productData.name = req.body.name;
            if (req.body.type !== undefined) productData.type = req.body.type;
            if (req.body.weight !== undefined) productData.weight = req.body.weight;
            if (req.body.purity !== undefined) productData.purity = req.body.purity;
            if (req.body.pricePerKg !== undefined) productData.pricePerKg = req.body.pricePerKg;
            if (req.body.factory !== undefined) productData.factory = req.body.factory;

            if (req.body.addAlloy) {
                const { element, percentage } = req.body.addAlloy;
                if (!productData.alloys) productData.alloys = {};
                productData.alloys[element] = percentage;
            }
            
            metalProducts[index] = productData;
            
            writeMetalData(metalProducts);
            
            const product = new MetalProduct(productData);
            res.json({
                message: 'Metal product partially updated',
                product: product
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete('/metal/:id', (req, res) => {
        try {
            const metalProducts = readMetalData();
            const index = metalProducts.findIndex(p => p.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Metal product not found' 
                });
            }
            
            const deletedProductData = metalProducts.splice(index, 1)[0];
            const deletedProduct = new MetalProduct(deletedProductData);
            writeMetalData(metalProducts);
            
            res.json({
                message: 'Metal product deleted successfully',
                product: deletedProduct
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};