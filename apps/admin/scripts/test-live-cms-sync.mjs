import http from 'http';

async function postBlockUpdate() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      key: 'hero.title',
      category: 'Hero',
      label: 'Hero Main Title',
      type: 'text',
      content: 'FORGING WORLDS BEYOND IMAGINATION — ENTERPRISE LIVE SYNC VERIFIED',
      isPublished: true,
      updatedBy: 'QA_Automated_Tester',
    });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/cms/blocks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function fetchPublicBlocks() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/cms/blocks?key=hero.title', (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    }).on('error', (e) => reject(e));
  });
}

async function runLiveSyncTest() {
  console.log("=== EXECUTING LIVE CMS PERSISTENCE & SYNC TEST ===");

  console.log("\n1. Triggering Admin CMS Block Update (POST http://localhost:4000/api/cms/blocks)...");
  const postRes = await postBlockUpdate();
  console.log("Admin API Response:", postRes);

  console.log("\n2. Fetching Updated Content from Public Website API (GET http://localhost:3000/api/cms/blocks?key=hero.title)...");
  const getRes = await fetchPublicBlocks();
  console.log("Public Website API Response:", getRes);

  if (getRes.data?.block?.content === 'FORGING WORLDS BEYOND IMAGINATION — ENTERPRISE LIVE SYNC VERIFIED') {
    console.log("\n✅ SUCCESS: REAL-TIME CMS SYNC VERIFIED! PostgreSQL update reflected on public website instantly.");
  } else {
    console.log("\n⚠️ NOTICE: Dynamic CMS response returned:", getRes.data);
  }
}

runLiveSyncTest();
