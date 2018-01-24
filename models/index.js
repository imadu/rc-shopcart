const mongoose = require('mongoose');
const Schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose),
      ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    username: String,
    password: String, // hash created from password
    email: String,
    state: String,
    role: String,
    created_at: {type: Date, default: Date.now}
})

const productSchema = Schema({
	id: ObjectId,
	name: String,
	image: String,
	price: Number,
	description: String,
	//One to many relationship
	manufacturer: {type:ObjectId, ref:'Manufacturer'}
});

const manufacturerSchema = Schema({
	id: ObjectId,
	name: String,
});

const User = model('User', userSchema);
const Product = model('Product', productSchema);
const Manufacturer = model('Manufacturer', manufacturerSchema);

module.exports = {User, Product, Manufacturer};