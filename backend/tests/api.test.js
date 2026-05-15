const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('🚀 Pruebas de Integración - API PsicoRose', () => {
  
  // 1. Prueba del endpoint de Salud
  describe('GET /api/health', () => {
    it('Debería retornar un estado 200 y el mensaje de salud', async () => {
      const res = await request(app).get('/api/health');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'ok');
      expect(res.body).to.have.property('message').that.includes('PsicoRose API');
    });
  });

  // 2. Prueba de Rutas inexistentes
  describe('GET /api/ruta-que-no-existe', () => {
    it('Debería retornar un error 404', async () => {
      const res = await request(app).get('/api/ruta-que-no-existe');
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message').that.includes('no encontrada');
    });
  });

});
