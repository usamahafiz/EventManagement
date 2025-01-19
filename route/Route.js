const express = require("express");
const routers = express.Router();
const User = require("../models/user");
const Event = require("../models/Event");

const { register, login } = require("../controller/authController");
// const {
//     createEvent,
//     getAllEvents,
//     getEventById,
//     updateEvent,
//     deleteEvent,
// } = require("../controller/EventController");
// const { uploadedImage } = require("../middleware/multer")

// Routes for authentication
routers.post("/register", register);
routers.post("/login", login);




//Routes for event handlers
// routers.post("/createevents", uploadedImage.single('Image'), createEvent)
// routers.get("/readEvents", getAllEvents)
// routers.get("/geteventbyid/:id", getEventById)
// routers.put("/updateEvents/:id", updateEvent)
// routers.delete("/deleteEvents/:id", deleteEvent)


module.exports = routers;




// const {register, login, verifyToken} = require('../controllers/authController');


// // Verify Token Route
// routers.post('/verify-token', verifyToken);



// module.exports = routers;