import express from "express";
import {
    post_contact, 
    post_inspection,
    get_houses,
    get_lands,
    get_user_single_property
} from "../controllers/reach_us_controller.js";

const reach = express.Router()

reach.post("/contact", post_contact)
reach.post("/inspect", post_inspection)
reach.get("/houses", get_houses)
reach.get("/lands", get_lands)
reach.get("/single-property/:id", get_user_single_property)

export default reach