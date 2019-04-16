const express = require('express');
const router = express.Router();

const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://dev-117825.okta.com/',
  token: '00Regr-41ROC64cDOHPrVS-XF7RD4eCJhdOf3RUj81'    // Obtained from Developer Dashboard
});

// declare axios for making http requests
const axios = require('axios');


/* GET user listing. */
router.get('/', (req, res) => {
    res.send('Okta server route works');
});


//
// ─── GET USER BY LOGIN ──────────────────────────────────────────────────────────
//

  router.get('/GetUserByLogin/:userLogin', (req, res) => {
    axios.get(`https://dev-117825.okta.com/api/v1/users/${req.params.userLogin}`, 
    {
      headers: {
        "Accept":'application/json',
        "Content-Type": 'application/json',
        "Authorization":"SSWS 00nd9KMXXDL4G_0hDjDdGtMs7IUTa8K6Ddds3oOI_F"
      }
    })
    .then((user) => {
      res.status(200).json(user.data)
    })
    .catch((error) => {
      if (error.response.status === 404) {
        console.log('ERROR: User not found.')
        res.send('ERROR: User not found!')
      }
      console.log(error.response)
    })
  });
// ────────────────────────────────────────────────────────────────────────────────



//
// ─── HANDLE USER LOGIN ──────────────────────────────────────────────────────────
//

  // TODO: Update to dynamically pull url from config
  router.post('/login', (req, res) => {
      console.log("request: ");
      console.log(req);
      axios.post(`https://dev-117825.okta.com/api/v1/authn`, {
          "username": req.body.username,
          "password": req.body.password,
          "relayState": "localhost:4200",
          "options": {
            "multiOptionalFactorEnroll": false,
            "warnBeforePasswordExpired": false
          }
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
// ────────────────────────────────────────────────────────────────────────────────


//
// ─── HANDLE USER SIGNUP ──────────────────────────────────────────────────────────
//

  router.post('/signup', (req, res) => {

    const newUser = {
      profile: {
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.username,
        login: req.body.username,
      },
      credentials: {
        password : {
          value: req.body.password
        }
      }
    };
    
    client.createUser(newUser)
    .then(user => {
      res.status(200).json(user)
      console.log('Created user', user)
    })
    .catch((err) => {
      console.log(err);
    });
  })

// TODO: Update to dynamically pull url from config
//   router.post('/signup', (req, res) => {
//     console.log(req);
//     axios.post(`https://dev-117825.okta.com/api/v1/users`, {
//       "profile": {
//       "firstName": req.body.fName,
//       "lastName": req.body.lName,
//       "email": req.body.username,
//       "login": req.body.username
//       },
//       "credentials": {
//         "password" : { "value": req.body.password }
//       }
//     }, 
//     {
//       headers:{
//         "Accept":'application/json',
//         "Content-Type": 'application/json'
//       }
//     })
//     .then(user => { 
//       // TODO: Create and return Session with Session Token 
//       // TODO: https://developer.okta.com/docs/api/resources/sessions/#create-session-with-session-token
//         res.status(200).json(user.data);
//     })
//     .catch(error => {
//       res.status(500).send('<p>'+ error +'</p>');
//     });
// });
// ────────────────────────────────────────────────────────────────────────────────


//
// ─── HANDLE USER FORGOT PASSWORD ────────────────────────────────────────────────
//

  router.post('/forgot', (req, res) => { 
      console.log("request: ");
      console.log(req);
      axios.post(`https://dev-117825.okta.com/api/v1/authn`, {
          "username": req.body.username,
          "relayState": "localhost:4200",
          "options": {
            "multiOptionalFactorEnroll": false,
            "warnBeforePasswordExpired": false
          }
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
        // No idea if the switch statement works or if I even did it right
        switch (error) {
          case res.status(500):
            res.status(500).send("<p>Error 500!</p>")
            break;
          case res.status(403):
            res.status(403).send("<p>Error 403!  User not found!</p>")
            break;
          default:
            res.status(500).send("<p>Error 500!</p>")
            break;
        };
      });
  })
// ────────────────────────────────────────────────────────────────────────────────


// Get user by ID
router.get('/users/:id', (req, res) => {

  var userId = req.params.id;

  axios.get(`https://dev-117825.okta.com/api/v1/users/${userId}`, {
    headers: {
      "Authorization": 'SSWS 00nd9KMXXDL4G_0hDjDdGtMs7IUTa8K6Ddds3oOI_F',
    }
  })
  .then(user => {
    if (user) { 
      res.status(200).send(user.data);
    }
    console.log('test');
  })
  .catch(error => {
    res.status(500).json('<p>'+ error +'</p>');
  });
 });


module.exports = router;