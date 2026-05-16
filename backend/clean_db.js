require('dotenv').config();
const mongoose = require('mongoose');

async function cleanAppointments() {
  try {
    console.log('--- Iniciando Limpieza de Citas ---');
    
    // Conectar a la DB usando tu URI del .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Acceder a la colección de appointments de forma directa para evitar errores de modelos
    const appointmentsCollection = mongoose.connection.collection('appointments');
    
    const result = await appointmentsCollection.deleteMany({});
    console.log(`🗑️ Se han eliminado ${result.deletedCount} citas de prueba.`);
    
    console.log('--- Limpieza completada con éxito ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  }
}

cleanAppointments();
