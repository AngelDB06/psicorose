const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Método oficial para listar modelos en las versiones más recientes
    const result = await genAI.listModels();
    
    console.log("--- MODELOS DISPONIBLES EN TU CUENTA ---");
    result.models.forEach(model => {
      console.log(`- ID: ${model.name}`);
      console.log(`  Descripción: ${model.description}`);
      console.log(`  Métodos: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('---------------------------------------');
    });
    
  } catch (error) {
    console.error("Error al obtener la lista de modelos:", error.message);
    console.log("Probando método alternativo...");
    // Si falla el anterior, probamos el de v1beta directamente
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      const data = await response.json();
      console.log("Modelos (v1beta):", data.models?.map(m => m.name));
    } catch (e) {
      console.error("También falló el método alternativo.");
    }
  }
}

listModels();
