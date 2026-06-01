const request = require('supertest');
const app = require('../../src/AG.app');

// Set test environment
process.env.JWT_SECRET = 'hopelink_secret_key_super_aman_123456';
process.env.NODE_ENV = 'test';

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123',
    phone_number: '081234567890',
    role: 'donor'
  };

  let token;

  // ─── REGISTER ───────────────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail if email already registered', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── LOGIN ──────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('role', 'donor');

      token = res.body.token;
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'notexist@example.com', password: 'password123' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── GET PROFILE ────────────────────────────────────────────
  describe('GET /api/auth/profile', () => {
    it('should return user profile with valid token', async () => {
      // Login first to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      const userToken = loginRes.body.token;

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', testUser.email);
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
