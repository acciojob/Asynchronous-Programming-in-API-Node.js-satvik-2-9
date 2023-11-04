// main.js
const fs = require('fs').promises;
const https = require('https'); // Use 'https' for 'https://' URLs

// Fetch data from API
function fetchFromAPI(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
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
    }).on('error', reject);
  });
}

// Save data to file
async function saveToFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Process the command-line arguments and perform the operations
async function main(url, filePath) {
  try {
    const data = await fetchFromAPI(url);
    await saveToFile(filePath, data);
    console.log(`Data from ${url} has been saved to ${filePath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1); // Exit the process with an error code
  }
}

// Check if we have the right amount of arguments
if (process.argv.length !== 4) {
  console.error('Usage: node main.js <API_URL> <FILE_PATH>');
  process.exit(1);
}

// Get command-line arguments
const [, , url, filePath] = process.argv;

// Call the main function with the command-line arguments
main(url, filePath);
