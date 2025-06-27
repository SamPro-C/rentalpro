require('dotenv').config({ path: '.env.local' });
const { exec } = require('child_process');

exec('node scripts/create-admin-user.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing script: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Script error output: ${stderr}`);
    return;
  }
  console.log(`Script output:\n${stdout}`);
});
