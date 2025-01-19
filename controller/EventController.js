const Event = require('../models/Event'); // Adjust path if necessary
const { uploadOnCloudinary } = require('../Utils/cloudinary'); // Adjust path if necessary

const createEvent = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const { eventTitle, location, description, category, date, } = req.body;

    // Validate required fields
    if (!eventTitle || !category || !date || !location || !req.file) {
      return res.status(400).json({ message: "All fields, including the image, are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }

    // Validate category
    const validCategories = ['Sports', 'Music', 'Tech', 'Workshop', 'Meetup'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category. Choose from: Sports, Music, Tech, Workshop, Meetup." });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (!uploadedImage) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
    }

    // Create and save the event in the database
    const newEvent = new Event({
      eventTitle,
      location,
      description,
      date,
      category,
      imageUrl: uploadedImage.secure_url,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ message: "Failed to create event.", error: error.message });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// Update an event by ID
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(400).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  const { _id } = req.params;
  console.log('Deleting product with ID:', _id);  
  try {
    const event = await Event.findByIdAndDelete(_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
