const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login endpoint...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@mess.local',
            password: 'admin123'
        });
        console.log('Success!', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Full error:', error);
    }
}

testLogin();
