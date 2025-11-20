const mongoose = require("mongoose")
const { Schema } = mongoose;

const paymentSchema = new Schema({

    date: String,
    month: String,
    year: String,
    amount: Number,
    studentname: { type: Schema.Types.Mixed },

    trans: Number
})

module.exports = mongoose.model("Payment", paymentSchema);




