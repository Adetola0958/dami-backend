import mongoose from "mongoose";

const propertySchema = mongoose.Schema(
    {
        propertyName:{type: String, required: true},
        location: {type: String, required: true},
        title: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: String, required: true},
        created_by:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Admin"
        },
        availability: {
            type: String,
            enum: ["sold", "available"],
            status: "available"
        },
        propertyType: {type: String, required: true},
        displayImage: {type: String}
    },
    {
        timestamps: true
    }
)

const Property = mongoose.model("Property", propertySchema)

export default Property