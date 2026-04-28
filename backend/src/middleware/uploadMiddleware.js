const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento dinámica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Si el campo es 'avatar', va a avatars. Si no, a posts.
    const folder = file.fieldname === 'avatar' ? 'avatars' : 'posts';
    cb(null, `src/uploads/${folder}`);
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
