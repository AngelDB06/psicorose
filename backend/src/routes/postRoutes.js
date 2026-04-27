const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ──────────────── Rutas Públicas ────────────────
router.get('/', postController.getPosts);
router.get('/:slug', postController.getPostBySlug);

// ──────────────── Rutas de Administrador ────────────────
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/admin/all', postController.getAdminPosts);
router.post('/', postController.createPost);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
