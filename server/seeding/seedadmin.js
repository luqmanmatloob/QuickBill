const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Adjust path if necessary

const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10);

            const adminUser = new User({
                username: 'admin',
                password: hashedPassword,
                secretKey: '123',
                jwtSecretKeyAppend: 1
            });

            await adminUser.save();
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

module.exports = createAdminUser;
