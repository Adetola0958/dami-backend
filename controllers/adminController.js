import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";
import Property from "../models/property.js"
import Contact from "../models/contact.js";
import Inspection from "../models/inspection.js";

export const admin_register = asyncHandler(async(req, res) => {
    try {
        const {name, email, phoneNumber, password} = req.body
        console.log(req.body)

        if(!name || !email || !phoneNumber || !password){
            res.json({
                status: "error",
                error: "Please enter all required fields"
            })
        }else {
            const adminExist = await Admin.find({})

            const adminCheck = await Admin.find({$or: [{email}, {phoneNumber}]})

            if(adminCheck.length > 0) {
                throw new Error("This admin already exists")
            }

            const harshedPassword = await bcrypt.hash(password, 10)

            if(adminExist == 0) {
                console.log("yes")
                const admin = await Admin.create({
                    name, password: harshedPassword, email, phoneNumber, isSuperAdmin: true
                })

                if (admin) {
                    console.log("yes")
                    res.status(201).json({
                        message: 'Admin created successfully.',
                        status: 'ok',
                        data: {
                            _id: admin._id,
                            name: admin.name,
                            email: admin.email,
                            phoneNumber: admin.phoneNumber,
                            isSuperAdmin: admin.isSuperAdmin,
                            token: generateToken(admin._id),
                        },
                    })
                } else {
                    console.log("no")
                    res.status(400)
                    throw new Error('Invalid data inputed')
                }
            }else{
                console.log("no")
                throw new Error("Admin cannot be more than one")
            }
        }
    } catch (error) {
        throw error
    }
})

export const admin_login = asyncHandler(async(req, res) => {
    try {
        const { email, password } = req.body

        if(!email || !password){
            res.json({
                status: "error",
                error: "Please enter all required fields"
            })
        }else {
            const admin = await Admin.findOne({ email })
        
            if(!admin ||
                admin.status !== 'active' ||
                !bcrypt.compareSync(password, admin.password)) {
                res.json({
                    status: "error",
                    error: "Please enter all required fields"
                })
            }else {
                res.json({
                    message: 'Login successful',
                    status: 'ok',
                    data: {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        phoneNumber: admin.phoneNumber,
                        isSuperAdmin: admin.isSuperAdmin,
                        token: generateToken(admin._id),
                    },
                })
            }
        }
    } catch (error) {
        throw error 
    }
})

export const create_property = asyncHandler(async(req, res) => {
    try { 
        const admin = await Admin.findById(req.admin.id)
        const { 
            propertyName,
            location,
            title,
            description,
            price,
            propertyType,
            displayImage
        } = req.body

        if(!propertyName || !location || !title || !description || !price || !propertyType || !displayImage) {
            res.json({
                status: "error",
                error: "Please enter all required fields"
            })
        }else {
            const property = await Property.create({
                created_by: admin._id,
                propertyName,
                location,
                title,
                description,
                price,
                propertyType,
                displayImage
            })
    
            if(property) {
                res.status(201).json({
                    status: "Success",
                    success: "property has been created",
                    data: property
                })
            }else{
                res.status(400)
                throw new Error('Invalid data provided.')
            }
        }
    } catch (error) {
       throw error 
    }
})

export const get_properties = asyncHandler(async(req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
        const properties = await Property.find({created_by: admin._id})
        if(properties){
            res.status(201).json({
                status: "Success",
                success: "Properties",
                data: {
                    properties
                }
            })
        }else {
            res.json({
                status: "error",
                error: "This admin does not have any properties"
            })
        }   
    } catch (error) {
        throw error
    }
})

export const get_paginated_properties = asyncHandler(async(req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
        if(!admin){
            res.json({
                status: "error",
                error: "You are not authorized to perform this action"
            })
        }else {
            const pageSize = 10
            const page = Number(req.query.pageNumber) || 1

            const count = await Property.countDocuments({created_by: admin._id})
            const properties = await Property.find({created_by: admin._id})
                .sort({createdAt: -1})
                .limit(pageSize)
                .skip(pageSize * (page - 1))
            if(!properties) {
                res.json({
                    status: "No properties found for this admin"
                })
            }else {
                res.status(201).json({
                    status: "success",
                    success: "properties",
                    data: {
                        properties,
                        meta: {
                            page,
                            pages: Math.ceil(count / pageSize),
                            total: count
                        }
                    }
                })
            }
        }
    } catch (error) {
        
    }
})

export const get_single_property = asyncHandler(async(req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
        const property = await Property.findOne({_id: req.params.id, created_by: admin._id})
        if(property){
            res.status(201).json({
                status: "Success",
                success: "property found!!!",
                data: {
                    property
                }
            })
        }else {
            throw new Error("This property does not exist")
        }
    } catch (error) {
        throw error
    }
})

export const update_single_property = asyncHandler(async(req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
        const property = await Property.findById(req.params.id)

        const{
            propertyName,
            location,
            title,
            description,
            price,
            propertyType,
            displayImage
        } = req.body

        if(property && admin){
            property.propertyName = propertyName || property.propertyName,
            property.location = location || property.location,
            property.title = title || property.title,
            property.description = description || property.description,
            property.price = price || property.price,
            property.propertyType = propertyType || property.propertyType,
            property.displayImage = displayImage || property.displayImage
        }

        const newProperty = await property.save()

        if(newProperty){
            res.status(201).json({
                status: "Success",
                success: "Property has been updated successfully",
                dtata: {
                    newProperty
                }
            })
        }else {
            res.status(400)
            throw new Error("Admin not found, therefore auntority to property is false")
        }
    } catch (error) {
        throw error
    }
})

export const delete_property = asyncHandler(async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
        const property = await Property.findByIdAndDelete(req.params.id)
        if (admin && property) {
            res.status(201).json({
                status: "Success",
                success: "Property has been deleted successfully"
            })
        } else {
            res.status(400)
            throw new Error('Admin not found, therefore auntority to property is false.')
        }
    } catch (error) {
        throw error
    }
})

export const get_contacts = asyncHandler(async(req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
        if(!admin){
            res.json({
                status: "error",
                error: "You are not authorized to perform this action"
            })
        }else {
            const pageSize = 10
            const page = Number(req.query.pageNumber) || 1

            const count = await Contact.countDocuments({})
            const contacts = await Contact.find({}).sort({createdAt: -1})
                .sort({createdAt: -1})
                .limit(pageSize)
                .skip(pageSize * (page - 1))
            if(!contacts) {
                res.json({
                    status: "No enquiries found for this admin"
                })
            }else {
                res.status(201).json({
                    status: "success",
                    success: "All enquiries made",
                    data: {
                        contacts,
                        meta: {
                            page,
                            pages: Math.ceil(count / pageSize),
                            total: count
                        }
                    }
                })
            }
        }
    } catch (error) {
        throw error
    }
})

export const get_inspections = asyncHandler(async(req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id)
        if(!admin){
            res.json({
                status: "error",
                error: "You are not authorized to perform this action"
            })
        }else {
            const pageSize = 10
            const page = Number(req.query.pageNumber) || 1

            const count = await Inspection.countDocuments({})
            const inspections = await Inspection.find({}).sort({createdAt: -1})
                .sort({createdAt: -1})
                .limit(pageSize)
                .skip(pageSize * (page - 1))
            if(!inspections) {
                res.json({
                    status: "No inspections found for this admin"
                })
            }else {
                res.status(201).json({
                    status: "success",
                    success: "All inspections required",
                    data: {
                        inspections,
                        meta: {
                            page,
                            pages: Math.ceil(count / pageSize),
                            total: count
                        }
                    }
                })
            }
        }
    } catch (error) {
      throw error  
    }
})