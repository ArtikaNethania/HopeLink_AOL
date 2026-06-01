const request = require('supertest');
const app = require('../../src/AG.app');

process.env.JWT_SECRET = 'hopelink_secret_key_super_aman_123456';
process.env.NODE_ENV = 'test';

describe('Community API', () => {
  let repToken;
  let donorToken;

  // Register a community_rep and a donor before tests
  beforeAll(async () => {
    const repEmail = `rep_${Date.now()}@example.com`;
    const donorEmail = `donor_${Date.now()}@example.com`;

    const repRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Community Rep',
        email: repEmail,
        password: 'password123',
        role: 'community_rep'
      });
    repToken = repRes.body.token;

    const donorRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Donor User',
        email: donorEmail,
        password: 'password123',
        role: 'donor'
      });
    donorToken = donorRes.body.token;
  });

  // ─── GET ALL COMMUNITIES ────────────────────────────────────
  describe('GET /api/communities', () => {
    it('should return list of approved communities', async () => {
      const res = await request(app)
        .get('/api/communities');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should be accessible without token', async () => {
      const res = await request(app)
        .get('/api/communities');

      expect(res.statusCode).toBe(200);
    });
  });

  // ─── REGISTER COMMUNITY ─────────────────────────────────────
  describe('POST /api/communities/register', () => {
    const communityName = `Test Community ${Date.now()}`;

    it('should register a community successfully', async () => {
      const res = await request(app)
        .post('/api/communities/register')
        .set('Authorization', `Bearer ${repToken}`)
        .send({
          name: communityName,
          location: 'Jakarta',
          description: 'A test community for unit testing',
          category: 'orphanage'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name', communityName);
      expect(res.body.data.verification_status).toBe('pending');
    });

    it('should fail without authentication token', async () => {
      const res = await request(app)
        .post('/api/communities/register')
        .send({
          name: `Another Community ${Date.now()}`,
          location: 'Bandung',
          description: 'No token test'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail if community name is missing', async () => {
      const res = await request(app)
        .post('/api/communities/register')
        .set('Authorization', `Bearer ${repToken}`)
        .send({
          location: 'Surabaya',
          description: 'Missing name test'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── GET COMMUNITY DETAIL ───────────────────────────────────
  describe('GET /api/communities/:id', () => {
    it('should return community detail for valid id', async () => {
      const res = await request(app)
        .get('/api/communities/3');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('community_id');
    });

    it('should return 404 for non-existent community', async () => {
      const res = await request(app)
        .get('/api/communities/999999');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── GET MY COMMUNITY ───────────────────────────────────────
  describe('GET /api/communities/my', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/communities/my');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return community for authenticated rep', async () => {
      const res = await request(app)
        .get('/api/communities/my')
        .set('Authorization', `Bearer ${repToken}`);

      // Either returns community or 404 if rep has no community yet
      expect([200, 404]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success');
    });
  });
});
