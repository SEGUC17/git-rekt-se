const express = require('express');
const bodyParser = require('body-parser');
const apiai = require('apiai');
const axios = require('axios');
const querystring = require('querystring');

const router = express.Router();
const ai = apiai(process.env.API_AI_TOKEN);

const facebookAPI = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

router.use(bodyParser.json());

// Facebook Webhook
router.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Invalid verify token');
  }
});

// generic function sending messages
function sendMessage(recipientId, message) {
  const postData = {
    recipient: {
      id: recipientId,
    },
    message,
  };
  axios.post(facebookAPI, postData)
    .then((res) => {
      console.log(res.data);
      console.log('Sent');
    })
    .catch((err) => {
      console.log(err.response.data.error);
    });
}

// Sending typing action
function sendTyping(recipientId) {
  const postData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on',
  };
  axios.post(facebookAPI, postData)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}

function Search(senderID, query) {
  axios.get('http://localhost:3000/api/v1/visitor/search', querystring.stringify(query))
    .then((response) => {
      console.log(response.data.results);
      // console.log(response.data.results[0].name);
      // for (let i = 0; i < 5; i += 1) {
      //   if (response.data.results[i]) {
      //     sendMessage(senderID, {
      //       text: response.data.results[i].name,
      //     });
      //   }
      // }
      sendMessage(senderID, {
        text: response.data.results[0].name,
      });
    })
    .catch((err) => {
      sendMessage(senderID, {
        text: 'There were an error search again.',
      });
    });
}


// handler receiving messages
router.post('/webhook', (req, res) => {
  // console.log(req.body);
  const events = req.body.entry[0].messaging;
  const event = events[0];
  if (event.message && event.message.text) {
    // console.log(event);
    const senderID = event.sender.id;
    sendTyping(senderID);

    const apiRequest = ai.textRequest(event.message.text, {
      sessionId: senderID,
    });
    let text;
    apiRequest.on('response', (response) => {
      // console.log(response);
      switch (response.result.action) {
        case 'Search':
          {
            const query = {
              name: response.result.parameters.name,
              location: response.result.parameters.location,
              category: response.result.parameters.category,
              min: response.result.parameters.minPrice,
              max: response.result.parameters.maxPrice,
            };
            Search(senderID, query);
            break;
          }
        default:
          {
            text = response.result.fulfillment.speech;
            sendMessage(senderID, {
              text,
            });
            break;
          }
      }
    });

    apiRequest.on('error', (error) => {
      sendMessage(senderID, 'Try Again');
    });

    apiRequest.end();
  }
  res.sendStatus(200);
});

module.exports = router;
