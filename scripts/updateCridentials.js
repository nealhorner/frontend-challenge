const fs = require('fs');
const dotenv = require('dotenv');
const { exec } = require('child_process');

// Open the .env file and update the DATABASE_URL with the value fetched from Heroku
const updateEnvFile = (databaseURL) => {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  envConfig.DATABASE_URL = databaseURL;
  newConfigText = ""
  for (const key in envConfig) {
    newConfigText += `${key}=${envConfig[key]}\n`
  }
  fs.writeFileSync('.env', newConfigText);
};

console.log('Fetching the DATABASE_URL from Heroku...');
exec('heroku config:get DATABASE_URL -a frontend-challenge-app', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Command execution error: ${stderr}`);
    return;
  }

  const databaseURL = stdout.trim();
  updateEnvFile(databaseURL);
});
