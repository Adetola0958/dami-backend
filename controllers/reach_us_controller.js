import Contact from "../models/contact.js";
import Inspection from "../models/inspection.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import Property from "../models/property.js";

export const post_contact = asyncHandler(async(req, res) => {
    const {name, email, phone, message} = req.body

    if(!name || !email || !phone || !message) {
        res.json({
            status: "error",
            error: "All fields are required"
        })
    }else {
        const contact = await Contact.create({name, email, phone, message})

        if(contact) {
            res.json({
                data: {

                    contact
                }
            })
        }
    }
})

export const post_inspection = asyncHandler(async(req, res) => {
    const {property, name, phone, email, date, time} = req.body

    if(!property || !name || !email || !phone || !date || !time) {
        res.json({
            status: "error",
            error: "All fields are required"
        })
    }else {
        const inspection = await Inspection.create({property, name, phone, email, date, time})

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true, // true for 465, false for other ports
            auth: { 
            user: process.env.SMTP_USER, // generated ethereal user
            pass: process.env.SMTP_PASS, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        let mailOptions = ({
            from: `"User" <${email}>`, // sender address
            to: "markgbolahan@gmail.com", // list of receivers
            subject: "Test Contact Message", // Subject line
            text: "Hello world?", // plain text body
            html: `${name} has requested for an inpection on ${property}, on ${date} at ${time}. Please call him on ${phone}, for follow up`, // html body
        })

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                return console.log(error)
            }else{
                res.status(201).json({
                    message: 'Mail has been sent successfully',
                     status: 'ok',
                })
            }
    
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        })

        if(inspection) {
            res.json({
                message: `${name} has requested for an inpection on ${property}, on ${date} at ${time}. Please call on ${phone}, for follow up`,
                data: {
                    property, 
                    name, 
                    phone, 
                    email, 
                    date, 
                    time, 
                    message: `${name} has requested for an inpection on ${property}, on ${date} at ${time}. Please call on ${phone}, for follow up`
                }
            })
        }
    }
})

export const get_houses = asyncHandler(async(req, res) => {
    try {
        const pageSize = 10
        const page = Number(req.query.pageNumber) || 1

        const count = await Property.countDocuments({})
        const houses = await Property.find({})
            .sort({createdAt: -1})
            .limit(pageSize)
            .skip(pageSize * (page - 1))

        const housingProperties = houses.filter((house) => {
            if(house.propertyType === "house") {
                return house
            }
        })

        if(!housingProperties) {
            res.json({
                status: "No houses found"
            })
        }else {
            res.status(201).json({
                status: "success",
                success: "All houses retrieved",
                data: {
                    houses: housingProperties,
                    meta: {
                        page,
                        pages: Math.ceil(count / pageSize),
                        total: count
                    }
                }
            })
        }
    } catch (error) {
        throw error
    }
})

export const get_lands = asyncHandler(async(req, res) => {
    try {
        const pageSize = 10
        const page = Number(req.query.pageNumber) || 1

        const count = await Property.countDocuments({})
        const lands = await Property.find({})
            .sort({createdAt: -1})
            .limit(pageSize)
            .skip(pageSize * (page - 1))

        const landedProperties = lands.filter((land) => {
            if(land.propertyType === "land"){
                return land
            }
        })
        console.log(landedProperties)
        if(!landedProperties) {
            res.json({
                status: "No lands found"
            })
        }else {
            res.status(201).json({
                status: "success",
                success: "All lands retrieved",
                data: {
                    lands: landedProperties,
                    meta: {
                        page,
                        pages: Math.ceil(count / pageSize),
                        total: count
                    }
                }
            })
        }
    } catch (error) {
        throw error
    }
})

export const get_user_single_property = asyncHandler(async(req, res) => {
    try {
        const property = await Property.findOne({_id: req.params.id})
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