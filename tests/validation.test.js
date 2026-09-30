const test = require('node:test');
const assert = require('node:assert/strict');

const app = require("../server");

async function callApi(path, payload) {
  const server = app.listen(0);
  const address = await new Promise((resolve) => {
    server.once('listening', () => resolve(server.address()));
  });

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { status: response.status, data };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test('KPR valid dengan bunga 0% dan tenor wajar', async () => {
  const response = await callApi('/api/kalkulator/kpr', {
    pinjaman: 200000000,
    bungaPersenPerTahun: 0,
    tenorTahun: 10,
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.jumlahBulan, 120);
  assert.ok(response.data.cicilanPerBulan > 0);
});

test('KPR menolak NaN dan Infinity', async () => {
  const response = await callApi('/api/kalkulator/kpr', {
    pinjaman: Number.NaN,
    bungaPersenPerTahun: Infinity,
    tenorTahun: 10,
  });

  assert.equal(response.status, 400);
  assert.match(response.data.error, /input/i);
});

test('Zakat menolak angka terlalu besar dan nilai tidak masuk akal', async () => {
  const response = await callApi('/api/kalkulator/zakat', {
    pendapatanPerBulan: 1000000000000,
    hargaEmasPerGram: 1000000000000,
  });

  assert.equal(response.status, 400);
  assert.match(response.data.error, /input/i);
});
