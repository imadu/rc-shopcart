const Model = require('../models');
const { Product, Manufacturer} = Model;

const manufacturerController = {
	all (req, res) {
		//Returns all the manufacturers
		Manufacturer.find({})
			.exec((err, manufacturers) => res.json(manufacturers));
	},


	
}

module.exports = manufacturerController;