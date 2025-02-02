require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('🟢 Conexión a MongoDB Atlas exitosa');
    } catch (error) {
        console.error('🔴 Error al conectar a MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
