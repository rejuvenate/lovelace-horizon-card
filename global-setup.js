module.exports = async () => {
  // Assures stable TZ for all tests
  process.env.TZ = 'UTC'
}
