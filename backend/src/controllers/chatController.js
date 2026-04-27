const { GoogleGenerativeAI } = require("@google/generative-ai");

// No inicializamos aquí para evitar errores si no hay API KEY
let genAI = null;
let model = null;

// @desc    Enviar un mensaje a la IA (Gemini)
// @route   POST /api/chat
// @access  Público
exports.getChatResponse = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'El mensaje es obligatorio' });
    }

    // Lógica de respuestas locales (Cerebro Local / Fallback)
    const getLocalResponse = (msg) => {
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes('ansiedad') || lowerMsg.includes('nervios')) {
        return "Entiendo que te sientas así. La ansiedad es una respuesta natural, pero puede ser abrumadora. La Dra. Rosa recomienda ejercicios de respiración profunda: inhala en 4 segundos, mantén 4 y exhala en 4. ¿Te gustaría profundizar en esto en una sesión?";
      }
      if (lowerMsg.includes('cita') || lowerMsg.includes('reservar') || lowerMsg.includes('sesión')) {
        return "Para reservar una sesión con la Dra. Rosa, puedes ir a la sección de 'Reservar Cita' en el menú superior. Allí verás las horas disponibles y podrás elegir la que mejor te venga.";
      }
      if (lowerMsg.includes('hola') || lowerMsg.includes('buenos días') || lowerMsg.includes('buenas')) {
        return "¡Hola! Soy el asistente virtual de PsicoRose. Estoy aquí para escucharte y darte orientación inicial. ¿En qué puedo ayudarte hoy?";
      }
      if (lowerMsg.includes('quien') || lowerMsg.includes('rosa') || lowerMsg.includes('doctora')) {
        return "La Dra. Rosa María Barranco es una psicóloga con años de experiencia en bienestar emocional y salud mental. Su enfoque es cercano y profesional. Puedes leer más sobre ella en la sección 'Sobre mí'.";
      }
      if (lowerMsg.includes('triste') || lowerMsg.includes('depre') || lowerMsg.includes('mal')) {
        return "Siento mucho que estés pasando por un momento difícil. Es valiente reconocer cómo te sientes. Recuerda que no estás solo/a y que hablar con un profesional puede marcar la diferencia. ¿Has pensado en agendar una consulta de valoración?";
      }
      return "Es un tema interesante. Como asistente virtual, te sugiero que hables de esto con la Dra. Rosa para tener una orientación personalizada. ¿Te gustaría que te explicara cómo funciona la primera consulta?";
    };

    // Intentar conectar con Gemini siguiendo la investigación técnica
    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '') {
        throw new Error('No API Key');
      }

      if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      }

      // El único modelo realmente disponible y gratuito en 2026 para esta cuenta
      const modelName = "gemini-3.1-flash-lite-preview";
      
      // Intentar hasta 4 veces si hay saturación (503), ya que los picos suelen ser de pocos segundos
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          const currentModel = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: "Eres el asistente virtual de PsicoRose, la consulta de psicología de la Dra. Rosa María Barranco. Tu tono es empático, profesional y calmado. Tu función es informativa y orientativa, NO reemplazas a un terapeuta profesional. Basas tus respuestas en la psicología cognitivo-conductual. Si detectas menciones de autolesión o crisis graves, debes proporcionar números de emergencia (112 o 024 en España) inmediatamente. Sé breve y acogedor.",
            generationConfig: { temperature: 0.5 }
          }, { apiVersion: 'v1beta' });

          const chat = currentModel.startChat({ history: history || [] });
          const result = await chat.sendMessage(message);
          replyText = result.response.text();
          success = true;
          console.log(`✅ IA respondió con éxito (Intento ${attempt})`);
          break; 
        } catch (err) {
          lastError = err;
          // Si es un error de saturación o cuota temporal, esperamos y reintentamos
          if ((err.message.includes('503') || err.message.includes('429')) && attempt < 4) {
            console.warn(`Saturación en ${modelName} (Intento ${attempt}/4), reintentando en 1.5s...`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            continue;
          }
          break; // Si es otro tipo de error, no reintentamos
        }
      }

      if (!success) throw lastError;
      return res.json({ reply: replyText, isDemo: false });
    } catch (apiError) {
      console.warn('Gemini API falló, usando cerebro local:', apiError.message);
      return res.json({ 
        reply: getLocalResponse(message),
        isDemo: true 
      });
    }

  } catch (error) {
    console.error('Error en PsicoRose AI (Gemini):', error.message);
    res.status(500).json({ message: 'Error al conectar con la IA de Google. Inténtalo de nuevo más tarde.' });
  }
};
