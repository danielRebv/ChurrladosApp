const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/inventory')
    .then(async () => {
        console.log('MongoDB connected');
        
        const user = new User({
            username: 'admin',
            password: 'password123'
        });
        await user.save();
        console.log('User created');
        mongoose.connection.close();
    })
    .catch(err => console.log(err));
