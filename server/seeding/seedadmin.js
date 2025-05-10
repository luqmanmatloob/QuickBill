const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); 

const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10);

            const adminUser = new User({
                username: 'admin',
                password: 123, // FIX: Use hashed password
                secretKey: '123', 
                jwtSecretKeyAppend: 1
            });
// this is suhayb's comment updated
            await adminUser.save();
            console.log('✅ Admin user created successfully.');
        } else {
            console.log('⚠️ Admin user already exists.');
        }
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
};

module.exports = createAdminUser;
