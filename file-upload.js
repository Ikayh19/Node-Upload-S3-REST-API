//import s3 bucket access details from .env file
require('dotenv/config')

// set up express server, Multer & aws-sdk
const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')

const app = express()
const port = 3000

// Set up aws s3 Object(create instance)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

// set up storage for Multer
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

// Set up Multer variable 
const upload = multer({storage}).single('file')

// Upload files
app.post('/upload',upload,(req, res) => {

    let myFile = req.file.originalname

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'Ikayh\'s folder/' + myFile.toString(),
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }

        res.status(200).send(data)
    })
})

// Set up port
app.listen(port, () => {
    console.log(`Server is up at ${port}`)
})