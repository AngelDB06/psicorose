const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento dinámica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    // Si el campo es 'avatar', va a avatars. Si no, a posts.
    const subfolder = file.fieldname === 'avatar' ? 'avatars' : 'posts';
    const finalPath = path.join(__dirname, '..', '..', 'uploads', subfolder);
    
    // Crear la subcarpeta si no existe
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }
    
    cb(null, finalPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('No es una imagen válida. Por favor, sube solo imágenes.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB para posts
});

module.exports = upload;
