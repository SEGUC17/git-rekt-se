const querystring = require('querystring');
const axios = require('axios');
const botErrors = require('../shared/Strings')
  .botErrors;

/**
 * Facebook EndPoint for sending messages.
 */
const facebookAPI = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

/**
 * Base URL.
 */
const BASE = 'http://localhost:3000';

/**
 * Search API EndPoint.
 */
const searchAPI = `${BASE}/api/v1/visitor/search`;

/**
 * Search Page URL.
 */
const searchPage = `${BASE}/search`;

/**
 * Service Page Base URL.
 */
const servicePageBase = `${BASE}/service`;

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
  axios.get(`${searchAPI}?${querystring.stringify(query)}`)
    .then((res) => {
      let services = res.data.results;
      if (services && services.length > 0) {
        services = services.slice(0, 4);
        const elements = services.map((service) => {
          return {
            title: service.name,
            subtitle: service.shortDescription,
            image_url: service.coverImage || '',
            default_action: {
              type: 'web_url',
              url: `${servicePageBase}/${service._id}`,
            },
            buttons: [{
              type: 'web_url',
              url: `${servicePageBase}/${service._id}`,
              title: 'View Service',
            }],
          };
        });
        const message = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'list',
              top_element_style: 'compact',
              elements,
              buttons: [{
                type: 'web_url',
                url: `${searchPage}`,
                title: 'View More',
              }],
            },
          },
        };
        sendMessage(senderID, message);
      }
    })
    .catch((err) => {
      console.log(err);
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
