const cors = require('cors');
const express = require('express');
// const router = express.Router();
const Chatkit = require('@pusher/chatkit-server');
const mongoose = require('mongoose');
const multer  = require('multer');
const upload = multer({ dest: 'upload/'});
const bodyParser = require('body-parser');
const axios = require('axios');

var router = express();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());


require('dotenv').config();

// Specify test token endpoing
// ! TESTING ONLY - Update for prod

/* GET user listing. */
router.get('/', (req, res) => {
    res.send('Chatkit server route works');
});



//
// ─── INSTANTIATE CHATKIT ────────────────────────────────────────────────────────
//

  // TODO: Dynamically pull config vars from env
  const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
    key: '9d72d14f-ca75-4f3e-b7ff-553ca6cc929a:LQKR0oU5u56yMIFtEBqLECL0vhNRXllLNvgtXTLOeh0=',
  });

// ────────────────────────────────────────────────────────────────────────────────



//
// ─── HANDLE SEND CONNECTION REQUEST TO ANOTHER USER ─────────────────────────────
//

  router.post('/invite', (req, res) => {
    console.log(req.body)
    // get the requested user...
    chatkit.getUser({
      id: req.body.userId,
    })
      .then((user) => { // then send the connection request => store in custom data
        // chatkit.updateUser({
        //   id: req.params.id,
        //   name: name,
        //   customData: req.body,
        // })
        //   .then(() => {
        //     console.log('Invite sent!')
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
        res.status(200).json(user)
        console.log(user)
    })
      .catch((err) => {
        console.log(err)
      })
  })

// ────────────────────────────────────────────────────────────────────────────────



//
// ─── GET READ CURSORS FOR USER ──────────────────────────────────────────────────
//
  router.get('/getReadCursorsForUser/:id', (req, res) => {

    chatkit.getReadCursorsForUser({
        userId: req.params.id,
      })
      .then(cursors => {
        res.status(200).json(cursors);
        console.log(cursors);
        console.log('got cursors', cursors)
      })
      .catch(err => console.error(err))
  })
// ────────────────────────────────────────────────────────────────────────────────



//
// ─── GET ALL CONNECTIONS FOR A USER BY ID ───────────────────────────────────────
//

  router.get('/connections/:id', (req, res) => {
    chatkit.getUser({
      // Get the user
      id: req.params.id,
    })
    .then((user) => {
      // Then get all of the users connections
      chatkit.getUsersById({
        userIds: user.custom_data.connections,
      })
      .then(users => res.status(200).json(users))
      .catch(err => console.error(err))
    })
    .catch(err => res.status(500).send(err))
  })
// ────────────────────────────────────────────────────────────────────────────────



//
// ─── UPDATE USER ────────────────────────────────────────────────────────────────
// 

  router.post('/user/:id', (req, res) => {
    console.log(req.body);

    let name = req.body.name;

    delete req.body.name;

    chatkit.updateUser({
      id: req.params.id,
      name: name,
      customData: req.body,
    }).then(() => {

      // console.log('User updated successfully');

      chatkit.getUser({
        id: req.params.id,
      })
      .then((user) => {
        console.log('UPDATED USER:', user)
        res.status(200).json(user) // Return the updated user
      })

    }).catch((err) => {
      console.log(err);
    });
  });
// ────────────────────────────────────────────────────────────────────────────────



//
// ─── GET USER ───────────────────────────────────────────────────────────────────
//
  
  router.post('/getuser', (req, res) => {

      chatkit.getUser({
          id: req.body.user_id,
      })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).send(err));
  });
// ────────────────────────────────────────────────────────────────────────────────



//
// ─── GET USER BY ID ─────────────────────────────────────────────────────────────
//

  router.get('/GetUserById/:userId', (req, res) => {
    chatkit.getUser({
      id: req.params.userId,
    })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).send(error))
  })
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── GET ALL USERS ─────────────────────────────────────────────────────────────
//

router.get('/users', (req, res) => {
  chatkit.getUsers()
  .then((users) => {
    res.status(200).json(users)
  }).catch((err) => {
    console.log(err);
  });
})
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── GET ALL ROOMS ─────────────────────────────────────────────────────────────
//

router.get('/rooms', (req, res) => {
  chatkit.getRooms({})
  .then((rooms) => {
    res.status(200).json(rooms)
  }).catch((err) => {
    console.log(err);
  });
})
// ────────────────────────────────────────────────────────────────────────────────



var type = upload.single('file');
// Upload room or user avatar to Mongo
router.post('/upload/avatar', type, (req, res) => {
  // console.log(req.body);
  // return;
  // mongoose.connect('mongodb+srv://chatversity_admin:Te0PU0MZzEQOIvmB@primary-qvaqq.mongodb.net/live_db?retryWrites=true', {useNewUrlParser: true});

  // var db = mongoose.connection;
  // db.on('error', console.error.bind(console, 'connection error:'));
  // db.once('open', function() {
  //   // we're connected!
  //   console.log('mongoose connected');

  //   // Define file schema
  //   var fileSchema = new mongoose.Schema({
  //     id: String
  //   });
  
  //   // Create object from schema
  //   var File = mongoose.model('files', fileSchema, 'files');
  
  //   var file = new File({avatar: req.body.file})
  //   // var fluffy = new File({ id: 'Silence' });
  //   // fluffy.save(function (err, fluffy) {
  //   //   if (err) return console.error(err);
  //   // });
  
  //   // File.find(function (err, files) {
  //   //   if (err) return console.error(err);
  //   //   console.log(files);
  //   // })
  });

  //
  // ─── CREATE USER ────────────────────────────────────────────────────────────────
  //

  router.post('/createuser', (req, res) => {
    console.log(req.body)
    chatkit.createUser({
      id: req.body.id,
      name: req.body.name,
      customData: req.body.custom_data,
    })
      .then((user) => {
        res.status(200).json(user);
        console.log('User created successfully');
      }).catch((err) => {
        console.log(err);
      });
  })
  // ────────────────────────────────────────────────────────────────────────────────



// Get user rooms
router.post('/GetUserRooms', async (req, res) => {
    
    chatkit.getUserRooms({
        userId: req.body.user_id,
    })
    .then((rooms) => res.status(200).json(rooms))
    .catch((err) => res.status(500).send(err));
});



// Get Chatkit User
// TODO: Update to dynamically pull url from config
router.post('/createtoken', (req, res) => {
    console.log('CHATKIT REQUEST:', req);
    axios.post(`${process.env.CHATKIT_TEST_TOKEN_ENDPOINT}/token`, {
        "grant_type": "client_credentials",
        "user_id": req.body.user_id
      },
      {
        headers:{
        "Accept":'application/json',
        "Content-Type": 'application/json'
        }
    })
    .then(user => { 
      // TODO: Create and return Session with Session Token 
      // TODO: https://developer.okta.com/docs/api/resources/sessions/#create-session-with-session-token
        res.status(200).json(user.data);
    })
    .catch(error => {
      res.status(500).send('<p>'+ error +'</p>');
    });
});


module.exports = router;