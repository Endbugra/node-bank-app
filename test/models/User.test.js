import User from '../../models/User.js';  // Modeli import ettiğimiz satır

// Test: Kullanıcı modelinin tanımlanıp tanımlanmadığını kontrol ediyoruz
test('User model should be defined', () => {
  expect(User).toBeDefined();  // User modelinin tanımlı olup olmadığını kontrol ediyoruz
});

// Diğer testler buraya eklenecek...


test('Kullanıcı kayıt endpointi çalışmalı', async () => {
  const response = await fetch('http://localhost:5001/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    }),
  });

  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.message).toBe("Kullanıcı başarıyla oluşturuldu");
  expect(data.user).toBeDefined();
  expect(data.user.email).toBe("testuser@example.com");
});

test('Kullanıcı giriş endpointi çalışmalı', async () => {
  const response = await fetch('http://localhost:5001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'testuser@example.com',
      password: 'password123',
    }),
  });

  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.message).toBe("Giriş başarılı");
});

test('Bakiye sorgulama endpointi çalışmalı', async () => {
  const response = await fetch('http://localhost:5001/balance/testuser@example.com', {
    method: 'GET',
  });

  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.balance).toBeDefined();
});

test('Bakiye artırma endpointi çalışmalı', async () => {
  const response = await fetch('http://localhost:5001/balance/increase/testuser@example.com', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 100,
    }),
  });

  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.balance).toBeGreaterThan(0);
});

test('Bakiye azaltma endpointi çalışmalı', async () => {
  const response = await fetch('http://localhost:5001/balance/decrease/testuser@example.com', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 50,
    }),
  });

  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.balance).toBeLessThan(100); // Bakiyenin azalmasını bekliyoruz
});
