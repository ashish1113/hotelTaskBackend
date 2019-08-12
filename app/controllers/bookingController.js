const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const moment = require('moment')
const passwordLib = require('./../libs/generatePasswordLib');
//const mailingLib = require("./../libs/mailingLib")
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')

const HotelModel = mongoose.model('Hotels')
const BookingModel = mongoose.model('Bookings')
const events = require('events');
const eventEmitter = new events.EventEmitter();

// to create new booking
let createNewBooking = (req, res) => {

    let validateBookingInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.checkInDate && req.body.checkOutDate && req.body.hotelId) {
                console.log("inside validate booking")
                if ((time.checkDateValidity(req.body.checkInDate) === true) && (time.checkDateValidity(req.body.checkInDate) === true)) { // check checki date is less than check out date
                    resolve(req)
                }
                else {
                    let apiResponse = response.generate(true, 'Checkin or checkout date are not valid', 400, null)
                    reject(apiResponse)
                }
            } else {
                logger.error('Field Missing During Booking  Creation', 'bookingController: createNewBooking()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }


    let getbookingOfHotel = (resolvedReq) => {
        return new Promise((resolve, reject) => {
            let checkInDate = new Date(resolvedReq.body.checkInDate)
            let checkOutDate = new Date(resolvedReq.body.checkOutDate)
            let monthOfCheckin = checkInDate.getMonth() + 1;
            let monthOfCheckOut = checkOutDate.getMonth() + 1;
            let yearOfCheckin = checkInDate.getFullYear;
            let yearOfCheckOut = checkOutDate.getFullYear;

            BookingModel.aggregate([
                { "$match": { hotelId: resolvedReq.body.hotelId1 } },
                // {"$project":{   "hotelId":"$hotelId",
                //                 "bookingId":"$bookingId",
                //                 "checkInDate":"$checkInDate",
                //                 // "checkinMon":{"$year":new Date("$CheckOutDate")},
                //                 "checkOutDate":"$checkOutDate",
                //                 // "checkinMon": moment("2019-02-16"),

                //                 //"checkOutMon":{"$month":ISODate($CheckOutDate)},
                //                 "checkinyear":{"$year":"$CheckInDate"},
                //                 "checkoutyear":{"$year":"$CheckOutDate"}}
                //             }

                { "$match": { $or: [{ checkInMonth: monthOfCheckin }, { checkOutMonth: monthOfCheckOut }] } },
                { "$match": { $or: [{ checkInYear: yearOfCheckin }, { checkOutYear: yearOfCheckOut }] } }

            ]).exec((err, result) => {
                console.log("result to chek here", result)
                if (err) {
                    logger.error(err.message, 'hotelController: createNewHote', 10)
                    let apiResponse = response.generate(true, 'Failed To Create HOtel ', 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(result)) {
                    console.log("chekout", resolvedReq.body.checkOutDate)
                    console.log(resolvedReq.body)
                    // let Booking = new BookingModel({
                    //    bookingId:shortid.generate(),
                    //    hotelId:resolvedReq.body.hotelId,
                    //    customerPhoneNo:resolvedReq.body.phoneNo,
                    //    city:resolvedReq.body.city,
                    //    checkInDate:new Date(resolvedReq.body.checkInDate),
                    //    checkOutDate:new Date(resolvedReq.body.checkOutDate),
                    //    checkInMonth:checkInDate.getMonth()+1,
                    //    checkOutMonth:checkOutDate.getMonth()+1,
                    //    checkInYear:checkInDate.getFullYear(),
                    //    checkOutYear:checkOutDate.getFullYear(),
                    //    state:resolvedReq.body.state,
                    //    noOfRoomsBooked:resolvedReq.body.noOfRoomsBooked
                    // })
                    // Booking.save((err, newBooking) => {
                    //     if (err) {
                    //         console.log("error while saving event: ", err)
                    //         logger.error(err.message, 'hotelController: createNewHotel->save', 10)
                    //         let apiResponse = response.generate(true, 'Failed to create new hotel', 500, null)
                    //         reject(apiResponse)
                    //     } else {
                    //         let newBookingObj = newBooking.toObject();

                    //         resolve(newBookingObj)

                    //     }
                    // })

                    let dataToResolve = {
                        "filteredBookings": result,
                        "reqObj": resolvedReq.body
                    }
                    console.log("type of result array", dataToResolve.filteredBookings.length)
                    resolve(dataToResolve)
                } else {
                    //logger.error('User Cannot Be Created hotel Already Present',  'hotelController: createNewHote', 4)
                    //   let apiResponse = response.generate(true, 'aggregated booking result', 200,result)
                    // let resultObj = result.toObject()
                    console.log("type of req", resolvedReq)
                    //let resolvedReqObj = resolvedReq.toObject();
                    let dataToResolve = {
                        "filteredBookings": result,
                        "reqObj": resolvedReq.body
                    }
                    console.log("type of result array", typeof dataToResolve.filteredBookings)
                    resolve(dataToResolve)
                }
            })

        })
    }
    //here write fun to check availiblity and 
    let checkForBookedRooms = (resolvedObj) => {
        return new Promise((resolve, reject) => {
            if (resolvedObj.filteredBookings.length > 0) {

            }
        })
    }

    validateBookingInput(req, res)
        .then(getbookingOfHotel)
        .then((resolve) => {

            let apiResponse = response.generate(false, ' aggregated or created booking', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}


// to be continued*******






//check for availablity on dates
//     let getbookingOfHotel =()=>{
//         return new Promise((resolve, reject) => {
//             BookingModel.find({'hotelId': req.body.hotelId})
//             .exec((err, result) => {
//                 if (err) {
//                     console.log(err)
//                     logger.error(err.message, 'Booking Controller: getSingelHotel', 10)
//                     let apiResponse = response.generate(true, 'Failed To Find HOtel Details', 500, null)
//                     reject(apiResponse)
//                 } else if (check.isEmpty(result)) {
//                 //     logger.info('No Hotel Found', 'Booking Controller: getSingelHotel')
//                 //     let apiResponse = response.generate(true, 'No Hotel Found', 404, null)
//                 //  //  reject(apiResponse)
//                 let resultFinal = {
//                     "bookings":[],
//                     "reqObj":req
//                 }
//                 let finalBookingListObj = resultFinal.toObject
//                 // let apiResponse = response.generate(false, 'Booking Details Found', 200, resultFInal)
//                resolve(finalBookingListObj)

//                 } else {
//                     let resultFinal = {
//                         "bookings":result,
//                         "reqObj":req
//                     }
//                     let finalBookingListObj = resultFinal.toObject
//                     // let apiResponse = response.generate(false, 'Booking Details Found', 200, resultFInal)
//                    resolve(finalBookingListObj)
//                 }
//             })
//         })


//     }

//     let getNoOfRoomsBooked =(bookingArrayObj)=>{
//         return new Promise((resolve, reject) => {
//             let bookingArray = bookingArrayObj.bookings
//             let reqObj = bookingArrayObj.reqObj
//             var date2 = new Date(reqObj.body.checkOutDate);
//             var date1 = new Date(reqObj.body.checkInDate);
//             var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));
//             let dateWiseBookingArray = []
//             let maxRoomBookedforRange = 0
//             for(let i=0;i<diffDays;i++){
//                 var dateToCheck = new Date(date1)
//                 dateToCheck.setDate(date1.getDate() + i);
//                 for (let j in bookingArray)
//                 {
//                    let checkinDateTemp = new Date (bookingArray[j].checkinDate)
//                     let checkinOutTemp = new Date (bookingArray[j].checkinOut)
//                       if (dateToCheck >= checkinDateTemp && dateToCheck <checkinOutTemp)
//                       {
//                         var index = dateWiseBookingArray.map(function(o)  { return o.attr1; }).indexOf("2019-10-10");
//                         //console.log("index of 'john': " + index);
//                         //alert(index)
//                         if (index == -1){
//                             let tempObj = {
//                                 "Date":dateToCheck,
//                                 "room":bookingArray[j].noOfRoomsBooked
//                             }
//                             dateWiseBookingArray.push(tempObj)
//                         }else{
//                             dateWiseBookingArray[index].room=  dateWiseBookingArray[index].room + bookingArray[j].noOfRoomsBooked
//                         }

//                       }
//                 }
//             }

//             for(let x of dateWiseBookingArray ) 
//             {
//                 if (maxRoomBookedforRange < x.room)
//                 {
//                     maxRoomBookedforRange = x.room
//                 }
//             }


//             let resultWithNoOfRoomBooked ={
//                 "req": reqObj,
//                 "maxRoomBooked": maxRoomBookedforRange
//             }

//             resolve(resultWithNoOfRoomBooked)

//         })


// }//getNoOfRoomsBooked

// after here write function to get hotel details and if t-h-room -maxr00m booked from above >= required room
// then create booking 



// let checkAvailiblityOnDates =(hotelId,checkInDate,checkOutDate) =>{

//     let getbookingOfHotel =(hotelId,checkInDate,checkOutDate)=>{
//         return new Promise((resolve, reject) => {
//             BookingModel.find({'hotelId': hotelId})
//             .exec((err, result) => {
//                 if (err) {
//                     console.log(err)
//                     logger.error(err.message, 'Hotel Controller: getSingelHotel', 10)
//                     let apiResponse = response.generate(true, 'Failed To Find HOtel Details', 500, null)
//                     res.send(apiResponse)
//                 } else if (check.isEmpty(result)) {
//                     logger.info('No Hotel Found', 'Hotel Controller: getSingelHotel')
//                     let apiResponse = response.generate(true, 'No Hotel Found', 404, null)
//                     res.send(apiResponse)
//                 } else {
//                     let apiResponse = response.generate(false, 'Hotel Details Found', 200, result)
//                     res.send(apiResponse)
//                 }
//             })
//         })


//     }

// }

module.exports = {
    createNewBooking: createNewBooking
}