const fs = require('fs');
const path = require('path');
const AlcoholProduct = require('./alcohol-factory');
const alcoholMethods = require('./alcohol-route');

alcoholMethods(AlcoholProduct);

const DATA_PATH = path.join(__dirname, '../data/alcohol-data.json');

function readAlcoholData() {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        const parsed = data ? JSON.parse(data) : { alcoholProducts: [] };
        return parsed.alcoholProducts || [];
    } catch (err) {
        console.error('Error reading alcohol data:', err);
        return [];
    }
}

function writeAlcoholData(alcoholProducts) {
    try {
        const data = {
            alcoholProducts: alcoholProducts,
            factoryInfo: {
                name: "Alcohol Production Group",
                location: "Moscow, Russia",
                established: 1990,
                license: "ALC-2024-RU-001",
                productionCapacity: "100000 liters/month",
                productTypes: ["vodka", "whiskey", "beer", "wine", "liquer"]
            }
        };
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing alcohol data:', err);
    }
}

module.exports = app => {
   
    app.get('/alcohol', (req, res) => {
        try {
            const alcoholProductsData = readAlcoholData();
            const products = alcoholProductsData.map(data => {
                const product = new AlcoholProduct(data);
                return product.getInfo();
            });
            res.json({
                count: products.length,
                products: products
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/alcohol', (req, res) => {
        try {
            const { name, type, volume, strength, price, aging, factory } = req.body;
            
            if (!name) {
                return res.status(400).json({ 
                    error: 'Name is required' 
                });
            }
            
            let product;
            
            if (type) {
                switch(type.toLowerCase()) {
                    case 'vodka':
                        product = AlcoholProduct.createVodka(name);
                        break;
                    case 'whiskey':
                        product = AlcoholProduct.createWhiskey(name);
                        break;
                    case 'beer':
                        product = AlcoholProduct.createBeer(name);
                        break;
                    case 'wine':
                        product = AlcoholProduct.createWine(name);
                        break;
                    default:
                        product = AlcoholProduct.create(req.body);
                }
            } else {
                product = AlcoholProduct.create(req.body);
            }
            
            if (volume !== undefined) product.changeVolume(volume);
            if (strength !== undefined) product.updateStrength(strength);
            if (price !== undefined) product.setPrice(price);
            if (aging !== undefined) product.addAging(aging);
            if (factory !== undefined) product.factory = factory;
            
            const alcoholProducts = readAlcoholData();
            
            alcoholProducts.push({
                id: product.id,
                name: product.name,
                type: product.type,
                volume: product.volume,
                strength: product.strength,
                price: product.price,
                productionDate: product.productionDate,
                aging: product.aging,
                factory: product.factory
            });
            
            writeAlcoholData(alcoholProducts);
            
            res.status(201).json({
                message: 'Alcohol product created successfully',
                product: product.getInfo()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/alcohol/:id', (req, res) => {
        try {
            const alcoholProducts = readAlcoholData();
            const productData = alcoholProducts.find(p => p.id === req.params.id);
            
            if (!productData) {
                return res.status(404).json({ 
                    error: 'Alcohol product not found' 
                });
            }
            
            const product = new AlcoholProduct(productData);
            res.json(product.getInfo());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put('/alcohol/:id', (req, res) => {
        try {
            const alcoholProducts = readAlcoholData();
            const index = alcoholProducts.findIndex(p => p.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Alcohol product not found' 
                });
            }
            
            const { name, type, volume, strength, price, aging, factory } = req.body;
            
            const originalProduct = alcoholProducts[index];
            
            alcoholProducts[index] = {
                id: originalProduct.id,
                name: name || originalProduct.name,
                type: type || originalProduct.type,
                volume: volume || originalProduct.volume,
                strength: strength || originalProduct.strength,
                price: price || originalProduct.price,
                productionDate: originalProduct.productionDate,
                aging: aging !== undefined ? aging : originalProduct.aging,
                factory: factory || originalProduct.factory
            };
            
            writeAlcoholData(alcoholProducts);
            
            const updatedProduct = new AlcoholProduct(alcoholProducts[index]);
            res.json({
                message: 'Alcohol product updated successfully',
                product: updatedProduct.getInfo()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.patch('/alcohol/:id', (req, res) => {
        try {
            const alcoholProducts = readAlcoholData();
            const index = alcoholProducts.findIndex(p => p.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Alcohol product not found' 
                });
            }
            
            const productData = alcoholProducts[index];
            const product = new AlcoholProduct(productData);
            
            if (req.body.name !== undefined) product.name = req.body.name;
            if (req.body.type !== undefined) product.type = req.body.type;
            if (req.body.volume !== undefined) product.changeVolume(req.body.volume);
            if (req.body.strength !== undefined) product.updateStrength(req.body.strength);
            if (req.body.price !== undefined) product.setPrice(req.body.price);
            if (req.body.aging !== undefined) product.addAging(req.body.aging);
            if (req.body.factory !== undefined) product.factory = req.body.factory;
            
            alcoholProducts[index] = {
                id: product.id,
                name: product.name,
                type: product.type,
                volume: product.volume,
                strength: product.strength,
                price: product.price,
                productionDate: product.productionDate,
                aging: product.aging,
                factory: product.factory
            };
            
            writeAlcoholData(alcoholProducts);
            
            res.json({
                message: 'Alcohol product partially updated',
                product: product.getInfo()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete('/alcohol/:id', (req, res) => {
        try {
            const alcoholProducts = readAlcoholData();
            const index = alcoholProducts.findIndex(p => p.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Alcohol product not found' 
                });
            }
            
            const deletedProductData = alcoholProducts.splice(index, 1)[0];
            const deletedProduct = new AlcoholProduct(deletedProductData);
            writeAlcoholData(alcoholProducts);
            
            res.json({
                message: 'Alcohol product deleted successfully',
                product: deletedProduct.getInfo()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};