const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const logStream = fs.createWriteStream('error.log', { flags: 'w' });

function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

log('Testing MongoDB Connection...');
log('URI: ' + process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        log('SUCCESS: MongoDB Connected!');
        logStream.end(() => process.exit(0));
    })
    .catch(err => {
        log('ERROR: Connection Failed');
        log('Code: ' + err.code);
        log('Name: ' + err.name);
        log('Message: ' + err.message);
        logStream.end(() => process.exit(1));
    });
