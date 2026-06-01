require('dotenv').config();
const app = require('./AG.app');
const sequelize = require('./config/AI.database');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connected');
    // alter: true sementara untuk create tabel event_registrations
    // Setelah server berhasil jalan sekali, ganti ke alter: false
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    console.log('✓ Models synced');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('✗ Database error:', err);
    process.exit(1);
  });

module.exports = { sequelize };