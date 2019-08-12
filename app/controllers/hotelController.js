const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
//const mailingLib = require("./../libs/mailingLib")
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
//const AuthModel = mongoose.model('Auth')
const HotelModel = mongoose.model('Hotels')
const events = require('events');
const eventEmitter = new events.EventEmitter();

//const checkEvent = require('./../libs/checkEventLib')
//const cron = require("node-cron");


// to do create new hotel

let createNewHotel = (req, res) => {

    let validateHotelInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.hotelEmail && req.body.hotelPhoneno && req.body.hotelName) {
                if (!validateInput.Email(req.body.hotelEmail)) {
                    let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
                    reject(apiResponse)
                }
                else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During hotel  Creation', 'hotelController: createNewHotel()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate hotel details input

    let createHotel = () => {
        return new Promise((resolve, reject) => {
            HotelModel.findOne({ hotelEmail: req.body.hotelEmail, })
                .exec((err, retrievedHotelDetails) => {
                    if (err) {
                        logger.error(err.message, 'hotelController: createNewHote', 10)
                        let apiResponse = response.generate(true, 'Failed To Create HOtel ', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedHotelDetails)) {
                        console.log(req.body)
                        let newHotel = new HotelModel({
                            hotelId: shortid.generate(),
                            hotelName: req.body.hotelName,
                            hotelPhoneno: req.body.hotelPhoneno,
                            hotelEmail: req.body.hotelEmail,
                            city: req.body.city,
                            state: req.body.state,
                            totalNoOfRooms: req.body.totalNoOfRooms
                        })
                        newHotel.save((err, newHotel) => {
                            if (err) {
                                console.log("error while saving event: ", err)
                                logger.error(err.message, 'hotelController: createNewHotel->save', 10)
                                let apiResponse = response.generate(true, 'Failed to create new hotel', 500, null)
                                reject(apiResponse)
                            } else {
                                let newHotelObj = newHotel.toObject();

                                resolve(newHotelObj)

                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created hotel Already Present', 'hotelController: createNewHote', 4)
                        let apiResponse = response.generate(true, 'Hotel Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })

    }
    validateHotelInput(req, res)
        .then(createHotel)
        .then((resolve) => {

            let apiResponse = response.generate(false, 'Hotel created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}

// to get all hotels
let getAllHotels = (req, res) => {
    HotelModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Hotel Controller: getAllHotel', 10)
                let apiResponse = response.generate(true, 'Failed To Find Hotel Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Hotel Controller: getAllHotel')
                let apiResponse = response.generate(true, 'No Hotel Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Hotels Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all hotel

// to get a single hotel info
let getSingleHotel = (req, res) => {
    HotelModel.findOne({ 'hotelId': req.params.hotelId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Hotel Controller: getSingelHotel', 10)
                let apiResponse = response.generate(true, 'Failed To Find HOtel Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Hotel Found', 'Hotel Controller: getSingelHotel')
                let apiResponse = response.generate(true, 'No Hotel Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Hotel Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single hotel info

module.exports = {
    createNewHotel: createNewHotel,
    getSingleHotel: getSingleHotel,
    getAllHotels: getAllHotels
}