const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

// file upload
router.post('/', function (req, res, next) {
  // eslint-disable-next-line
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.response = {
        status: 500,
        message: 'Error in file upload from Multer!',
        error: err
      }
      return next()
    } else if (err) {
      // An unknown error occurred when uploading.
      res.response = {
        status: 500,
        message: 'Error in file upload!',
        error: err
      }
      return next()
    }

    // Everything went fine.
    var uploadFiles = req.files
    var dataArray = []
    uploadFiles.map((file) => {
      var payload = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileName: file.filename,
        size: file.size, // eslint-disable-next-line
        url: `${baseURL}${baseFilePath}${file.filename}`
      }
      dataArray.push(payload)
    })
    res.response = {
      status: 200,
      message: 'Upload Successfully!',
      data: dataArray
    }
    return next()
  })
})

// file delete
router.delete('/', async (req, res, next) => {
  // eslint-disable-next-line

  // Everything went fine.
  var removeFiles = req.body
  var dataArray = []
  await Promise.all(
    removeFiles.map(async (file) => {
      const path = 'src/public/img/upload/' + file.fileName
      try {
        await unlinkAsync(path)
        dataArray.push(file)
      } catch (e) {
        console.log(e)
        dataArray.push({ error: `Error on deleting the file ${file.fileName}` })
      }
    })
  )
  res.response = {
    status: 200,
    message: 'Deleted Successfully!',
    data: dataArray
  }
  return next()
})

module.exports = router
