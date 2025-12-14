const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createMember = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mdsiam386siam:Sadik2022@cluster0.l5ghbsu.mongodb.net/mess_management');
        console.log('MongoDB Connected');

        // Member credentials
        const memberData = {
            name: 'John Doe',
            email: 'member@mess.com',
            password: 'member123',
            role: 'member'
        };

        // Check if member already exists
        let existingMember = await User.findOne({ email: memberData.email });
        if (existingMember) {
            console.log('Member user already exists!');
            console.log('Email:', memberData.email);
            console.log('You can login with the existing member account.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(memberData.password, salt);

        // Create member user
        const member = new User({
            name: memberData.name,
            email: memberData.email,
            password: hashedPassword,
            role: memberData.role
        });

        await member.save();

        console.log('✅ Member user created successfully!');
        console.log('-----------------------------------');
        console.log('Name:', memberData.name);
        console.log('Email:', memberData.email);
        console.log('Password:', memberData.password);
        console.log('-----------------------------------');
        console.log('You can now login with these credentials.');

        process.exit(0);
    } catch (err) {
        console.error('Error creating member:', err);
        process.exit(1);
    }
};

createMember();
