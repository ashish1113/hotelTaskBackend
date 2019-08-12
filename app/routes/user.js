  
const express = require('express');
const router = express.Router();
const appConfig = require("./../../config/appConfig")
const hotelController = require('./../controllers/hotelController')
const bookingController = require('./../controllers/bookingController')
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // to create hotel
    app.post(`${baseUrl}/create/hotel`, hotelController.createNewHotel);
    // to create booking
    app.post(`${baseUrl}/create/booking`,bookingController.createNewBooking);
}