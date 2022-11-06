import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
    {
        name: {type: String, },
        email: {type: String, },
        password: { type: String,  },
        phoneNumber: { type: String,  },
        status: {
			type: String,
			enum: ['active', 'blocked', 'deleted'],
			default: 'active',
		},
    },
    {
        timeStamps: true,
    }
)

const Admin = mongoose.model('Admin', adminSchema)

export default Admin