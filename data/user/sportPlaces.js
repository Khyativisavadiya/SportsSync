import { sportPlaces } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const reserve = async (sportPlaceID, userID) => {
  // add user to the users field (an array) in sportPlace collection
};

const quit = async (sportPlaceID, userID) => {};

const rate = async (sportPlaceID, userID, rate) => {};

// const getAllByCity = async (city) => {};

// const getAllByState = async (state) => {};

const getSportPlace = async (sportPlaceID) => {};

const getAllSportPlaces = async () => {};

const getSportPlacesBySport = async (sportID) => {};

const getSportPlacesByPriceRange = async (min, max) => {};

const getAvailableSportPlaces = async () => {}; // SportPlaces that the capacity is not full

// sorting ?
