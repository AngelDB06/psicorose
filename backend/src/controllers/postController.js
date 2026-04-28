const Post = require('../models/Post');

// @desc    Obtener todos los artículos publicados
// @route   GET /api/posts
// @access  Público
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error en getPosts:', error.message);
    res.status(500).json({ message: 'Error al obtener los artículos' });
  }
};

// @desc    Obtener un artículo por slug
// @route   GET /api/posts/:slug
// @access  Público
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Solo permitir ver posts publicados públicamente
    if (!post.published) {
      return res.status(403).json({ message: 'Este artículo no está publicado' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error en getPostBySlug:', error.message);
    res.status(500).json({ message: 'Error al obtener el artículo' });
  }
};

// @desc    Crear un nuevo artículo
// @route   POST /api/posts
// @access  Privado/Admin
exports.createPost = async (req, res) => {
  try {
    const { title, excerpt, content, category, image, readTime, published } = req.body;

    // Generar slug a partir del título (ej: "Mi Primer Post" -> "mi-primer-post")
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Elimina caracteres especiales
      .replace(/[\s_-]+/g, '-') // Reemplaza espacios por guiones
      .replace(/^-+|-+$/g, ''); // Elimina guiones al principio y final

    // Comprobar si el slug ya existe
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: 'Ya existe un artículo con un título muy similar. Por favor cámbialo.' });
    }

    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      category,
      image: req.file ? `/uploads/posts/${req.file.filename}` : image,
      readTime,
      published: published !== undefined ? published : true,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error en createPost:', error.message);
    res.status(500).json({ message: 'Error al crear el artículo' });
  }
};

// @desc    Actualizar un artículo
// @route   PATCH /api/posts/:id
// @access  Privado/Admin
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Si hay una nueva imagen subida
    if (req.file) {
      req.body.image = `/uploads/posts/${req.file.filename}`;
    }

    // Actualizar campos
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Error en updatePost:', error.message);
    res.status(500).json({ message: 'Error al actualizar el artículo' });
  }
};

// @desc    Eliminar un artículo
// @route   DELETE /api/posts/:id
// @access  Privado/Admin
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    await post.deleteOne();
    res.json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    console.error('Error en deletePost:', error.message);
    res.status(500).json({ message: 'Error al eliminar el artículo' });
  }
};

// ──────────────── Funciones de Administrador ────────────────

// @desc    Obtener TODOS los artículos (incluidos borradores)
// @route   GET /api/posts/admin/all
// @access  Privado/Admin
exports.getAdminPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error en getAdminPosts:', error.message);
    res.status(500).json({ message: 'Error al obtener todos los artículos' });
  }
};
