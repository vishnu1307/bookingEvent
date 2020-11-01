
const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/img/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage }).array('file')

global.baseFilePath = process.env.FILE_PATH || '/img/upload/'
global.baseURL = process.env.BASE_URL || 'localhost:3000'
global.upload = upload