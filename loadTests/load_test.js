import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 500,  
  duration: '50s',
};

// Array to store created short codes during the test
let createdShortCodes = [];

export default function () {
  // 70% of requests will be redirects, 30% will be shortening new URLs
  const shouldRedirect = Math.random() < 0.7;

  if (shouldRedirect && createdShortCodes.length > 0) {
    // Test redirect endpoint
    const randomCode = createdShortCodes[Math.floor(Math.random() * createdShortCodes.length)];
    
    const res = http.get(`http://localhost:3000/redirect?code=${randomCode}`, {
      timeout: '10s',
    });

    check(res, {
      'redirect status is 200': (r) => r.status === 200,
      'redirect response time < 2s': (r) => r.timings.duration < 2000,
      'redirect has url property': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.url !== undefined;
        } catch {
          return false;
        }
      },
      'redirect url is valid': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.url && (body.url.startsWith('http://') || body.url.startsWith('https://'));
        } catch {
          return false;
        }
      },
    });
  } else {
    // Test shorten endpoint
    const testUrls = [
      'https://example.com',
      'https://google.com',
      'https://github.com',
      'https://stackoverflow.com',
      'https://docs.google.com/document/d/123',
      'https://medium.com/@user/article-title'
    ];
    
    const randomUrl = testUrls[Math.floor(Math.random() * testUrls.length)] + `?t=${Date.now()}`;
    
    const payload = JSON.stringify({ url: randomUrl });
    const params = {
      headers: { 'Content-Type': 'application/json' },
      timeout: '10s',
    };

    const res = http.post('http://localhost:3000/shorten', payload, params);

    const isSuccess = check(res, {
      'shorten status is 200': (r) => r.status === 200,
      'shorten response time < 5s': (r) => r.timings.duration < 5000,
      'shorten has shortUrl': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.shortUrl !== undefined;
        } catch {
          return false;
        }
      },
      'shortUrl format is valid': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.shortUrl && body.shortUrl.match(/^[a-f0-9]{6}$/);
        } catch {
          return false;
        }
      },
    });

    // Store the short code for future redirect tests
    if (isSuccess && res.status === 200) {
      try {
        const body = JSON.parse(res.body);
        if (body.shortUrl && createdShortCodes.length < 100) {
          createdShortCodes.push(body.shortUrl);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }

  // Small delay between requests to simulate realistic usage
  sleep(0.1);
}