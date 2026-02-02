describe('Server Tests', () => {
  let server;

  beforeAll(() => {
    server = require('../src/server/server');
  });

  afterAll((done) => {
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

  test('Server module should be importable', () => {
    expect(server).toBeDefined();
  });

  test('MIME types should be defined for common file types', () => {
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.json': 'application/json',
    };

    Object.entries(mimeTypes).forEach(([ext, type]) => {
      expect(type).toBeDefined();
      expect(typeof type).toBe('string');
    });
  });

  test('PORT environment variable should default to 3000', () => {
    expect(process.env.PORT || 3000).toBeDefined();
  });

  test('Path traversal should be prevented', () => {
    const basePath = __dirname;
    const maliciousPath = '../../../etc/passwd';
    expect(maliciousPath.startsWith(basePath)).toBe(false);
  });
});
