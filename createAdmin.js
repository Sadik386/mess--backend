const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mess_management');
        console.log('MongoDB Connected');

        // Admin credentials
        const adminData = {
            name: 'Admin',
            email: 'admin@mess.com',
            password: 'admin123',
            role: 'admin'
        };

        // Check if admin already exists
        let existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', adminData.email);
            console.log('You can login with the existing admin account.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const admin = new User({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            role: adminData.role
        });

        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);
        console.log('-----------------------------------');
        console.log('You can now login with these credentials.');

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
