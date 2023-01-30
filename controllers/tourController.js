import Tour from "../models/tour.js";
import mongoose from "mongoose";

//@desc Create a tour
//@route POST /tours
//@access Private
export const createTour = async (req, res) => {
  const tour = req.body;
  const newTour = new Tour({
    ...tour,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// export const getTours = async (req, res) => {
//   try {
//     const tours = await Tour.find();
//     res.status(200).json(tours);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// add pagination to getTours
//@desc Get all tours
//@route GET /tours
//@access Public
export const getTours = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await Tour.countDocuments({}); // get the total number of documents in the collection
    const tours = await Tour.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: tours, // return the tours
      currentPage: Number(page), // return the current page
      numberOfPages: Math.ceil(total / LIMIT), // return the total number of pages
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Get a tour
// @route GET /tours/:id
// @access Public
export const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json(tour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Get tours by user
// @route GET /tours/user/:id
// @access Public
export const getToursByUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No tour with id: ${id}`);
    }
    const userTours = await Tour.find({ creator: id });
    res.status(200).json(userTours);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// export const getToursByUser = async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)){
//     return res.status(404).json({ message: "No tour with that id" });
//   }
//   const userTours = await Tour.find({ creator: id });
//   res.status(200).json(userTours);
//   // try {
//   // } catch (error) {
//   //   res.status(404).json({ message: error.message });
//   // }
// };

// @desc Delete a tour
// @route DELETE /tours/:id
// @access Private
export const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No tour with id: ${id}`);
    }
    await Tour.findByIdAndRemove(id);
    res.json({ message: "Tour deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Update a tour
// @route PATCH /tours/:id
// @access Private
export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageFile, creator, tags } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No tour with id: ${id}`);
    }
    const updatedTour = {
      creator,
      title,
      description,
      imageFile,
      tags,
      _id: id,
    };

    await Tour.findByIdAndUpdate(id, updatedTour, { new: true });
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc get tours by search
// @route GET /tours/search
// @access Public
export const getToursBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i"); // i means case insensitive search (searches for all occurences)
    const tours = await Tour.find({ title });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc get tours by tag
// @route GET /tours/tags/:tag
// @access Public
export const getToursByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const tours = await Tour.find({ tags: { $in: tag } }); // $in is a mongoDB operator that searches for all occurences of the tag in the tags array
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc get related tours
// @route POST /tours/related
// @access Public
export const getRelatedTours = async (req, res) => {
  const tags = req.body;
  try {
    const tours = await Tour.find({ tags: { $in: tags } });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc like a tour
// @route POST /tours/like/:id
// @access Private
export const likeTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res.json({ message: "User is not authenticated" });
    }

    // check if tour exists 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }

    const tour = await Tour.findById(id);

    // check if user has already liked the tour
    const index = tour.likes.findIndex((id) => id === String(req.userId));

    // if user has not liked the tour, add user id to likes array
    if (index === -1) {
      tour.likes.push(req.userId);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.userId));
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, tour, {
      new: true,
    });

    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
