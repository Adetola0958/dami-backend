import express from "express";
import admin from "./adminRoutes.js";
import reach from "./reachRoutes.js";

const apiRoutes = express.Router()

apiRoutes.get('/api/docs', (req, res) => {
	res.render('index')
})

apiRoutes.use("/api/v1/admin", admin)
apiRoutes.use("/api/v1/reach", reach)

export default apiRoutes