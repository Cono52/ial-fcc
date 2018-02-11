const mongoose = require('mongoose');
const shortid  = require('shortid');
mongoose.Promise = global.Promise;

const Schema = new mongoose.Schema({
    "term": String,
    "when": {type: Date, default: Date.now},
});


const SearchTerm = mongoose.model('Schema', Schema, 'searchterms');

SearchTerm.getSearchTerms = (callback, limit) => {
    SearchTerm.find(callback).limit(limit)
};

module.exports = SearchTerm;
