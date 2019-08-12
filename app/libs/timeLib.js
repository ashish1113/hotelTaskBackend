const moment = require('moment')
const momenttz = require('moment-timezone')
const timeZone = 'Asia/Calcutta'
let now = () => {
  return moment.utc().format()
}

let getLocalTime = () => {
  return moment().tz(timeZone).format()
}

let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('LLLL')
}

let addHoursToDay = (date, hours) => {
  return moment(date).add(hours, 'h')
}
//custom function
let timeMinutesHourSetter = (hour, min) => {
  let hourSetted = (hour * 1.00) + (min / 60);
  return hourSetted;
}                          //small
let checkEndDateAndHour = (date1, date2) => {
  let dateA = moment(date1);
  let dateB = moment(date2);

  if ((dateB.diff(dateA, 'day')) === 0) {
    return 0;
  } else {
    return ((dateB.diff(dateA, 'day')) * 24)
  }
}
let checkDateValidity =(date)=>{
  let dateA = new Date (date);
  if(dateA >= new Date ())
  {
    return true;
  }
  else{
    return false
  }
}


module.exports = {
  now: now,
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime,
  addHoursToDay: addHoursToDay,
  timeMinutesHourSetter: timeMinutesHourSetter,
  checkEndDateAndHour: checkEndDateAndHour,
  checkDateValidity:checkDateValidity
}