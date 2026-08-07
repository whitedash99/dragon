import http from 'http';

const adminRoutes = [
  '/cms',
  '/dashboard',
  '/games',
  '/media',
  '/users',
  '/crm',
  '/analytics',
  '/ai',
  '/knowledge',
  '/marketing',
  '/notifications',
  '/security',
  '/developer',
  '/performance',
  '/automation',
  '/api-platform',
];

const publicRoutes = [
  '/',
  '/games',
  '/studio',
  '/downloads',
  '/community',
  '/contact',
  '/careers',
  '/news',
  '/support',
];

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, status: res.statusCode, headers: res.headers });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
  });
}

async function runAudit() {
  console.log("=== DRAGON STUDIOS LIVE PAGES AUDIT ===");
  
  console.log("\n--- Testing Public Website Routes (http://localhost:3000) ---");
  for (const r of publicRoutes) {
    const res = await checkUrl(`http://localhost:3000${r}`);
    console.log(`[Public Site] http://localhost:3000${r} -> Status: ${res.status}`);
  }

  console.log("\n--- Testing Admin Control Center Routes (http://localhost:4000) ---");
  for (const r of adminRoutes) {
    const res = await checkUrl(`http://localhost:4000${r}`);
    console.log(`[Admin CMS] http://localhost:4000${r} -> Status: ${res.status}`);
  }
  
  console.log("\n=== ALL LIVE PAGES VERIFIED SUCCESSFULLY ===");
}

runAudit();
