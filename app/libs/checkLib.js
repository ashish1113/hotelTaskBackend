'use srict'

let trim = (x) => {
  let value = String(x)
  return value.replace(/^\s+|\s+$/gm, '')
}
let isEmpty = (value) => {
  if (value === null || value === undefined || trim(value) === '' || value.length === 0) {
    return true
  } else {
    return false
  }
}

function checkLastFiveChar1(str) {
  var str1 = "";

  for (let i = str.length - 5; i < str.length; i++) {
    str1 = str1.concat(str[i]);


  }
  console.log(str1);

  if (str1 == "admin") {

    console.log(str1 + " is matched");
    var res = str.slice(0, str.length - 5);

    console.log(res);
    return res;
  } else {
    return str;
  }







}

/**
 * exporting functions.
 */
module.exports = {
  isEmpty: isEmpty
}