module.exports = (app) => {
    const cards = require('../controllers/card.controller.js');

    // Create a new Card
    app.post('/cards/add', cards.create);

    // Retrieve all Cards
    app.get('/cards/getall', cards.findAll);
}