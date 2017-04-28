const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

const router = express.Router();
const api = apiai('d7ccf4b57f004e59967247dd5e1aee45');


router.use(bodyParser.urlencoded({
  extended: false,
}));
router.use(bodyParser.json());


// Facebook Webhook
router.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === 'testbot_verify_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Invalid verify token');
  }
});

// generic function sending messages
function sendMessage(recipientId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN || 'EAAGGZAMvZC92IBAPW90lR3AvfdtSvsfCYSU2GE1dLf7RH3sBMArWq0WbMXUbvV6rMLGOeaFwtasgF0EYvx5wDXnIvHh6tyxZBVHhCtUNDuZAMrJIm1HAYvGXptPlih6ZC1DWOPMdOpcIblmsiddk4osSeWQ1hzD8ZD',
    },
    method: 'POST',
    json: {
      recipient: {
        id: recipientId,
      },
      message,
    },
  }, (error, response, body) => {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
// Sending typing action
function sendTyping(recipientId) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN ||
                'EAAGGZAMvZC92IBAPW90lR3AvfdtSvsfCYSU2GE1dLf7RH3sBMArWq0WbMXUbvV6rMLGOeaFwtasgF0EYvx5wDXnIvHh6tyxZBVHhCtUNDuZAMrJIm1HAYvGXptPlih6ZC1DWOPMdOpcIblmsiddk4osSeWQ1hzD8ZD',
    },
    method: 'POST',
    json: {
      recipient: {
        id: recipientId,
      },
      sender_action: 'typing_on',
    },
  }, (error, response, body) => {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


// handler receiving messages
router.post('/webhook/', (req, res) => {
  const events = req.body.entry[0].messaging;
  const event = events[0];
  if (event.message && event.message.text) {
        // console.log(event);
    const senderID = event.sender.id;
    sendTyping(senderID);

    const ApiRequest = api.textRequest(event.message.text, {
      sessionId: senderID,
    });
    let text;
    ApiRequest.on('response', (response) => {
      console.log(response);
      switch (response.result.action) {
        case 'Search':
          sendMessage(senderID, 'I will search later');
          break;
        default:
          text = response.result.fulfillment.speech;
          sendMessage(esenderID, text);
          break;
      }
    });

    ApiRequest.on('error', (error) => {
      sendMessage(senderID, 'Try Again');
    });

    ApiRequest.end();
  }
  res.sendStatus(200);
});
