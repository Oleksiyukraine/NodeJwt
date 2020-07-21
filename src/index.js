Promise = require('bluebird');
const { port, env } = require('./config/vars');
const app = require('./config/express');
const sequelize = require('./config/sequelize');
const methodOverride = require('method-override');

sequelize.connect();

app.use(methodOverride('X-HTTP-Method-Override'));
app.listen(port, () => {
  console.info(`server started on port ${port} (${env})`);
});

module.exports = app;
