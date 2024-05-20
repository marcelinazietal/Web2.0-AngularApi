const db = require('../utils/db');

const laptopSchema = new db.Schema({
    imgUrl: {type: String},
    name: {type: String},
    price: {type: String},
    processor: { type: String },
    ram: { type: String },
    operating_system: { type: String },
    height: { type: String },
    width: { type: String },
    depth: { type: String },
    weight: { type: String },
    included_accessories: { type: String },
});

const LaptopModel = db.model("laptops", laptopSchema);

module.exports = LaptopModel;
