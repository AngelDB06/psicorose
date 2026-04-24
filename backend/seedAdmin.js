require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'rosa@psicorose.com'; // Puedes cambiarlo si quieres

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('El usuario administrador ya existe.');
      process.exit(0);
    }

    const adminUser = new User({
      name: 'Rosa',
      email: adminEmail,
      phone: '600000000',
      password: 'DRdae12091209',
      role: 'admin',
      isVerified: true,
    });

    await adminUser.save();
    console.log('✅ Usuario Administrador Rosa creado con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
    process.exit(1);
  }
};

seedAdmin();
