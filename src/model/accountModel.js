const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../helper/connect_mongodb')


const AcountSchema = new Schema({
    username: String,
    password: String,
    refreshToken: {
        type: String,
        default: null
    }
},
    {
        collection: 'account'
    })

const AcountModel = conn.model('account', AcountSchema)

module.exports = { AcountModel };