const fs = require('fs');
const https = require('https');  // Note: I'm using 'https' here because the given test URL uses HTTPS

function fetchFromAPI(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function saveToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = function fetchAndSave(url, filePath) {
  return fetchFromAPI(url)
    .then((data) => saveToFile(filePath, data));
};

// Calling fetchFromAPI and saveToFile with command-line arguments
const [,, apiUrl, outputFilePath] = process.argv;
if (apiUrl && outputFilePath) {
  fetchAndSave(apiUrl, outputFilePath)
    .then(() => console.log('Data fetched and saved successfully.'))
    .catch(error => console.error('Error:', error));
}
