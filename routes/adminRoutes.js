import express from "express";
import { 
    admin_register, 
    admin_login,
    create_property,
    get_properties,
    get_paginated_properties,
    get_single_property,
    update_single_property,
    delete_property,
    get_inspections,
    get_contacts
} from "../controllers/adminController.js";
import {protect} from "../middleware/auth-handler.js"
const admin = express.Router();

admin.post("/signin", admin_register)
admin.post("/login", admin_login)
admin.route("/property")
    .post(protect, create_property)
    .get(protect, get_properties)
admin.get("/paginated-properties", protect, get_paginated_properties)
admin.route("/property/:id")
    .get(protect, get_single_property)
    .patch(protect, update_single_property)
    .delete(protect, delete_property)
admin.get("/inspections", protect, get_inspections)
admin.get("/contacts", protect, get_contacts)

export default admin