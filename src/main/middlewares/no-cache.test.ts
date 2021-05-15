import request from 'supertest';
import { noCache} from './no-cache';
import app from '@/main/config/app';

describe('No Cache Middleware', () => {
  test('Should disable cache', async () => {
    app.get('/test_nocache', noCache, (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_nocache')
      .expect('cache-control', 'no-control, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});
