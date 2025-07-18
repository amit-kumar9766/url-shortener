import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1000,
  duration: '50s',
};

export default function () {
  const res = http.post('http://localhost:3000/shorten', JSON.stringify({ url: 'https://example.com' }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
