const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testUser = {
    name: 'Test Setup User',
    email: 'testsetup_' + Date.now() + '@example.com',
    password: 'password123',
    role: 'member'
};

async function testRegistration() {
    console.log('Testing Registration endpoint...');
    try {
        const res = await axios.post(`${API_URL}/register`, testUser);
        console.log('✅ Registration Successful!');
        console.log('Token received:', res.data.token ? 'Yes' : 'No');
    } catch (err) {
        console.log('❌ Registration Failed');
        if (err.response) {
            console.log('Status:', err.response.status);
            console.log('Data:', err.response.data);
        } else {
            console.log('Error:', err.message);
        }
    }
}

testRegistration();
