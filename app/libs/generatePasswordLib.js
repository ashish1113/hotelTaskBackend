const bcrypt = require('bcryptjs')
const saltRounds = 10
var crypto = require('crypto');

/* Custom Library */
let logger = require('../libs/loggerLib')

let hashpassword = (myPlaintextPassword) => {
  let salt = bcrypt.genSaltSync(saltRounds)
  let hash = bcrypt.hashSync(myPlaintextPassword, salt)
  return hash
}


let comparePassword = (oldPassword, hashpassword, cb) => {
  bcrypt.compare(oldPassword, hashpassword, (err, res) => {
    if (err) {
      logger.error(err.message, 'Comparison Error', 5)
      cb(err, null)
    } else {
      cb(null, res)
    }
  })
}


let comparePasswordSync = (myPlaintextPassword, hash ) => {
  return bcrypt.compareSync(myPlaintextPassword, hash)
}

let hashpasswordUsingMd5 =(myPlaintextPassword) =>
{
  var hash = crypto.createHash('md5').update(myPlaintextPassword).digest('hex');
  return hash;
}

let comparePasswordGenerated = (myPlaintextPassword, hashpassword ) => {

  let hash = crypto.createHash('md5').update(myPlaintextPassword).digest('hex');

  if (hash === hashpassword)
  {
    return true;
  } else{
    
    return false;
      
    }

    
  

}
module.exports = {
  hashpassword: hashpassword,
  comparePassword: comparePassword,
  comparePasswordSync: comparePasswordSync,
  hashpasswordUsingMd5:hashpasswordUsingMd5,
  comparePasswordGenerated:comparePasswordGenerated
}