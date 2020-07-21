
const Sequelize = require('sequelize');

const { postgres } = require('./vars');

const sequelize = new Sequelize(postgres.db, postgres.login, postgres.password, {
  host: postgres.host,
  dialect: 'postgres',
  dialectOptions: {
    // charset: 'utf8',
    charset: 'utf8mb4',
    collate: 'utf8_general_ci',
  },
  operatorsAliases: false,
  logging: false,
  define: {
    underscored: false,
    freezeTableName: false,
    syncOnAssociation: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize.query('')
  .then(() => sequelize
    .sync({
      force: true,
    }))
  //users password 111111
  .then(() => sequelize.query('INSERT INTO users VALUES (1, \'MotorAdmin\', \'motor@gmail.com\', true, \'[{"number":"(066)1111111","code":"+374","fullPhoneNumber":"+374(077)1111111","country":"Армения","default":true,"validate":true, "medias":{"telegram":null,"viber":null}}]\', \'2019-02-22 16:16:47\', \'$2a$10$fdQibKhmSicDn2.UrpFdmeDB.jO1nwLoNGv1K/X9X7Ra27sWSoQES\', \'admin\', \'2019-02-22 16:16:47.611000\', \'2019-02-22 16:16:47.611000\' );'))
  .then(() => sequelize.query('INSERT INTO users VALUES (2, \'FirstClient\', \'client@gmail.com\', false, \'[{"number":"667975007","code":"+380","fullPhoneNumber":"+380667975007","country":"Украина +380","default":true,"validate":true, "medias":{"telegram":null,"viber":null}}]\', \'2019-02-22 16:16:47\', \'$2a$10$fdQibKhmSicDn2.UrpFdmeDB.jO1nwLoNGv1K/X9X7Ra27sWSoQES\', \'user\', \'2019-02-22 16:16:47.611000\', \'2019-02-22 16:16:47.611000\' );'))
  .then(() => {
    console.log('Database synchronised.');
  }, (err) => {
    console.log(err);
  });

exports.connect = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });

  return sequelize;
};
exports.sequelize = sequelize;
