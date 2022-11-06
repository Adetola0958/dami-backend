import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

import { errorHandler } from "./middleware/error-handler.js";
import connectDB from "./config/db.js";

import apiRoutes from "./routes/indexRoutes.js";
//import admin from "./routes/adminRoutes.js";

const app = express();

const __dirname = path.resolve();

dotenv.config({path: "./config/config.env"});

connectDB().then();

app.use(morgan("dev"));

app.use(express.json());

app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(errorHandler)

app.use(apiRoutes)
app.get('/home', (req, res) => {
	res.redirect('/api/docs')
})
//app.use("/api/v1/admin", admin)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server starting at PORT ${PORT}`)
})