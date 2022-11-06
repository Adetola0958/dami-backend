import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema(
    {
        property: {type: String},
        name: {type : String},
        phone: {type: String},
        email: {type : String},
        date: {type: String},
        time: {type: String}
    },
    {
        timestamps: true
    }
)

const Inspection = mongoose.model('Inspection', inspectionSchema)

export default Inspection