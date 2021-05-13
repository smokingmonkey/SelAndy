const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Grid = require('gridfs-stream');

const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// ******DB stuff*******
const mongoose = require('mongoose');
const { response } = require('express');
const { timeStamp } = require('console');
const Schema = mongoose.Schema;
// Mongo URI
const mongoURI = 'mongodb+srv://fusuga93:atlas9DsJS3wmIW@cluster0.plqvv.mongodb.net/<dbname>?retryWrites=true&w=majority';
// Create mongo connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// For uploading the personal data
const personalDataSchema = new Schema({
  document: String,
  name: String,
  application: String,
  occupation: String,
  phoneNumber: String,
  dominantHand: String,
  gender: String,
  timeStamp: Number
}, { collection: "PersonalData" });

var PersonalData = mongoose.model('PersonalData', personalDataSchema);

// For uploading emotions array
const emotionsSchema = new Schema({
  document: String,
  application: String,
  neutral: [Number],
  happy: [Number],
  angry: [Number],
  fearful: [Number],
  surprised: [Number],
  sad: [Number],
  disgusted: [Number]
}, { collection: "Emotions" });

var Emotions = mongoose.model('Emotions', emotionsSchema);

const cognitiveEmotionsSchema = new Schema({
  name: String,
  document: String,
  test: String,
  neutral: [Number],
  happy: [Number],
  angry: [Number],
  fearful: [Number],
  surprised: [Number],
  sad: [Number],
  disgusted: [Number]
}, { collection: "Emotions cognitive videos" });

var cognitiveEmotions = mongoose.model('Emotions cognitive videos', cognitiveEmotionsSchema);

// For uploading the batak score
const batakSchema = new Schema({
  document: String,
  name: String,
  score: String,
  bpm: String
}, { collection: "Batak" });

var batakData = mongoose.model('Batak', batakSchema);

let gfs;
//let aliases = [];

// Connect GridFS and Mongo
conn.once('open', function () {
  console.log('- Connection open -');
  gfs = Grid(conn.db, mongoose.mongo);
  //gfs.collection('photos&videos');
  gfs.collection('cognitive videos');
});

//***** Create storage engine for photos *****
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        //const filename = buf.toString('hex') + path.extname(file.originalname);
        var filename;
        /*
        if (path.extname(file.originalname) == ".png" || path.extname(file.originalname) == ".jpeg") {
          filename = aliases[0] + file.originalname;

        } else if (path.extname(file.originalname) == ".mp4") {
          filename = aliases[0] + path.extname(file.originalname);
        }*/
        const fileInfo = {
          filename: file.originalname,
          aliases: Date.now(),
          bucketName: 'photos&videos',
          disableMD5: true
        };
        resolve(fileInfo);
      });
    });
  }
});
var upload = multer({ storage });
var type = upload.single('upl');

// To upload aspirant photo and video to MongoDB
app.post('/api', type, (request, response) => {
  response.redirect('/');
});

// To upload aspirant personal information to MongoDB
app.post('/data', (req, res) => {
  const data = req.body;

  //aliases = [data.pidNumber, data.application];

  const personaldata = new PersonalData({
    document: data.pidNumber,
    name: data.nameAndLastName,
    application: data.application,
    occupation: data.occupation,
    phoneNumber: data.phone,
    dominantHand: data.dominantHand,
    gender: data.gender,
    timeStamp: Date.now()
  });

  personaldata.save(function (err, personaldata) {
    if (err) return console.error(err);
    console.log('Personal data successfully uploaded!');
  });
});

// To upload aspirant emotions to MongoDB
app.post('/emotions', (req, res) => {
  const data = req.body;

  const emotions = new Emotions({
    document: aliases[0],
    application: aliases[1],
    neutral: data.neutral,
    happy: data.happy,
    angry: data.angry,
    fearful: data.fearful,
    surprised: data.surprised,
    sad: data.sad,
    disgusted: data.disgusted,

  });

  emotions.save(function (err, emotions) {
    if (err) return console.error(err);
    console.log('Emotions data successfully uploaded!');
  });

});

var userin = [];

app.post('/signin', (req, res) => {
  const data = req.body;
  userin = [data.name, data.pid];

});

app.post('/batak', (req, res) => {
  var data = req.body;

  data.name = userin[0];
  data.pid = userin[1];

  const batakdata = new batakData({
    document: data.pid,
    name: data.name,
    score: data.gameScore,
    bpm: data.bpm
  });

  batakdata.save(function (err, batakdata) {
    if (err) return console.error(err);
    console.log('Batak data successfully uploaded!');
  });
});


app.get('/multimedia/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/png' || file.contentType === 'image/jpeg' || file.contentType === 'video/mp4') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image or a video'
      });
    }
  });
});

app.get('/allmedia', (req, res) => {
  gfs.files.find({
    //filename: req.params.filename,
  })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'no files exist',
        });
      }
      res.json(files);
    });
});

app.get('/allusers', (req, res) => {
  //find all users
  PersonalData.find({}, (err, allUsers) => {

    if (err) console.error(err);

    res.json(allUsers)
  })
});

app.get('/download/:filename', (req, res) => {
  //write content from DB to file system with
  //the given name

  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    var fs_write_stream = fs.createWriteStream(path.join(__dirname, `writeTo/entrevista_${file.filename}`));

    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/png' || file.contentType === 'video/mp4') {
      // create read-stream from MongoDB
      // in this case, finding the correct file by 'filename'
      // but could also find by ID or other properties
      var readstream = gfs.createReadStream(file.filename);
      readstream.pipe(fs_write_stream);
      fs_write_stream.on('close', function () {
        console.log('File has been written fully!');
      });
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });

  res.redirect('/');

});

app.get('/downloadAllVideos', (req, res) => {
  //write content from DB to file system with
  //the given name

  gfs.files.find({}, (err, allVideos) => {

    allVideos.forEach(file => {
      var fs_write_stream = fs.createWriteStream(path.join(__dirname, `writeTo/zenu/${file.filename}`));

      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      // Check if image
      if (file.contentType === 'image/png' || file.contentType === 'video/mp4') {
        // create read-stream from MongoDB
        // in this case, finding the correct file by 'filename'
        // but could also find by ID or other properties
        var readstream = gfs.createReadStream(file.filename);
        readstream.pipe(fs_write_stream);
        fs_write_stream.on('close', function () {
          console.log('File has been written fully!');
        });
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });


  });

  res.redirect('/');

});

app.get('/AllEmotions', (req, res) => {

  cognitiveEmotions.find({}, (err, allFile) => {
    allFile.forEach(file => {
      var filename = `${file.document}_${file.test}.txt`;
      var emotionsArray = [];
      var row = [];

      for (let i = 0; i < file.neutral.length; i++) {
        row = [file.neutral[i], file.happy[i], file.angry[i], file.fearful[i], file.surprised[i], file.sad[i], file.disgusted[i]];
        emotionsArray.push(row);
      }

      fs.writeFile(`writeTo/zenu/emotions/${filename}`, emotionsArray.map(function (v) { return v.join(', ') }).join('\n'), function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('File written!');
        }
      });
    });

  });


  res.redirect('/');
});

app.get('/csv', (req, res) => {
  const infoArray = [["id_cedula", "id_nombre", "lumos_compt_aves_prdmnt1", "lumos_compt_aves_prdmnt2", "lumos_compt_tren_prdmnt1", "lumos_compt_tren_prdmnt2", "ishi_compt_visu_prdmnt1", "ishi_compt_visu_prdmnt2", "clrs_compt_visu_prdmnt1", "clrs_compt_visu_prdmnt2", "minn_compt_coloca_prdmnt1", "minn_compt_coloca_prdmnt2", "purd_compt_mandom_prdmnt1", "purd_compt_mandom_prdmnt2"]];
  const emotionLabels = ['Neutralidad', 'Alegria', 'Enojo', 'Miedo', 'Sorpresa', 'Tristeza', 'Repugnancia']
  const names = [];
  const documents = [];
  
  cognitiveEmotions.find({}, (err, allFile) => {
    for (file of allFile) {
      if (file.name != names[names.length - 1] && file.document != documents[documents.length - 1]) {
        names.push(file.name);
        documents.push(file.document);
        if (row !== undefined) infoArray.push(row);
        var row = [];
        row.push(file.document);
        row.push(file.name);
      }

      const meanEmotions = [mean(file.neutral), mean(file.happy), mean(file.angry), mean(file.fearful), mean(file.surprised), mean(file.sad), mean(file.disgusted)];
      const meanEmotions_copy = [mean(file.neutral), mean(file.happy), mean(file.angry), mean(file.fearful), mean(file.surprised), mean(file.sad), mean(file.disgusted)];
      const maximum = max(meanEmotions);
      const secMax = secondMax(meanEmotions_copy);
      
      row.push(emotionLabels[meanEmotions.indexOf(maximum)]);
      row.push(emotionLabels[meanEmotions.indexOf(secMax)]);
    }
    
    infoArray.push(row);

    fs.writeFile(`writeTo/zenu/csv/emocionesPorPrueba.csv`, infoArray.map(function (v) { return v.join(', ') }).join('\n'), function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('File written!');
      }
    });

  });

  res.redirect('/');

});

function mean(array) {

  return array.reduce((a, b) => a + b, 0) / array.length;
}

function max(arr) {
  return Math.max.apply(null, arr);
}

function secondMax(array) {
  var max = Math.max.apply(null, array); // get the max of the array
  array.splice(array.indexOf(max), 1); // remove max from the array
  return Math.max.apply(null, array); // get the 2nd max
};