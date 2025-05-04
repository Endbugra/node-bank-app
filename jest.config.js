export default {
  transform: {
    '^.+\\.js$': 'babel-jest', // Jest'in ES Modules'u desteklemesi için Babel kullanıyoruz
  },
  testEnvironment: 'node', // Node.js ortamında çalıştır
};