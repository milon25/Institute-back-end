const mongoose = require("mongoose")
const { Schema } = mongoose;

const resultSchema = new Schema({
  
    studentid: {
        type: mongoose.Types.ObjectId,
        ref: "Student"
    },
    departmentname: String,
    result: [
        {
            subject: String,
            result: String
        }
    ],
    cgpa: Number
})

module.exports = mongoose.model("Result",resultSchema);