const querystring = require('querystring');
const axios = require('axios');
const botErrors = require('../shared/Strings')
  .botErrors;

const facebookAPI = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

const searchAPI = 'http://localhost:3000/api/v1/visitor/search';

/**
 * Function For Sending a Message through facebook.
 * @param {string} recipientId - ID of the receiver.
 * @param {*} message - Content to be sent.
 */
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

/**
 * Sends a typing action to facebook.
 * @param {string} recipientId - ID of the receiver.
 */
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

/**
 * Sends a search query to the API
 * and sends the first 5 results.
 * @param {string} senderID - The ID of the person who initiated the query.
 * @param {any} query - The query parameters.
 */
function Search(senderID, query) {
  axios.get(searchAPI, querystring.stringify(query))
    .then((res) => {
      let services = res.data.results;
      if (services && services.length > 0) {
        services = services.slice(0, 5);
        services.forEach((service) => {
          sendMessage(senderID, {
            text: service.name,
          });
        });
      }
    })
    .catch(() => {
      sendMessage(senderID, {
        text: botErrors.generalError,
      });
    });
}

module.exports = {
  sendMessage,
  sendTyping,
  Search,
};
