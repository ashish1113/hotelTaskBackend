const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const Bookings = new Schema({
  bookingId: {
    type: String,
    default: '',

    unique: true
  },
  hotelId: {
    type: String,
    default: '',
},
  customerPhoneNo: {
    type: String,
    default: '',
},
  city: {
    type: String,
    default: 'Bangalore',
 },
  checkInDate: {
    type: Date,
  },
  checkInMonth: {
    // type: Number
  },
  checkInYear: {

  },

  checkOutDate: {
    type: Date,
  },
  checkOutMonth: {

  },
  checkOutYear: {

  },
  state: {
    type: String,
    default: 'Karnatka',
  },
  noOfRoomsBooked: {
    type: Number,
    default: 1,
  }

})

module.exports = mongoose.model('Bookings', Bookings)