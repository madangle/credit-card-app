const Card = require('../models/card.model.js');
var Luhn = require("luhn");

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request

    //validating all fields are provided
    if(!req.body.name || !req.body.number || !req.body.limit) {
        return res.status(400).send({
            message: "Card name, number and limit fields can not be empty"
        });
    }

    //validating a valid credit card number is provided
    if(typeof req.body.number != "number") {
        return res.status(400).send({
            message: "Please provide a valid card number, it should contain only numbers."
        });
    }

    //validating a valid card limit is provided
    if(typeof req.body.limit != "number") {
        return res.status(400).send({
            message: "Please provide a valid card limit, it should contain only numbers."
        });
    }

    //validating credit card number with luhn
    if(!Luhn.validate(req.body.number)) {
        return res.status(400).send({
            message: "Please provide a valid card number in the right format."
        });
    }
    
    // Create a Note
    const card = new Card({
        name: req.body.name || "Untitled Card", 
        number: req.body.number,
        limit: req.body.limit, 
        balance: req.body.balance || 0
    });

    // Save Note in the database
    card.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Card."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Card.find().sort({createdAt: -1})
    .then(cards => {
        res.send(cards);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving cards."
        });
    });
};


