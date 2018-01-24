import Sequelize from 'sequelize';
import az_pglib, {removeRoleAndDb, createRoleAndDb} from '../test-utils/azpg/az_pglib';

let postgresPort = 5432;
let postgresUser = 'rick';
let postgresDbName = 'db_rick_data';
let postgresPassword = 'xxxx1234';
let postgresHost = '127.0.0.1';
// postgresHost = 'localhost';

function getConnectString(user){
  let dbName = 'postgres';
  if(user === postgresUser){
    dbName = postgresDbName;
  }
  return `postgres://${user}:${encodeURI(postgresPassword)}@${postgresHost}:${postgresPort}/${dbName}`;
}

function resetTestDbAndTestRole(){
  let client = null;
  return az_pglib.create_connection(getConnectString('postgres'))
  .then((result) => {
    client = result.client;
    return result;
  })
  .then((result) => {
    console.log('======> removeRoleAndDb...');
    return removeRoleAndDb(client, postgresDbName, postgresUser);
  })
  .then((result) => {
    console.log('======> createRoleAndDb...');
    return createRoleAndDb(client, postgresDbName, postgresUser, postgresPassword);
  })
  .then((result) => {
    return client.end();
  });
}

export {
  postgresPort,
  postgresUser,
  postgresDbName,
  postgresPassword,
  postgresHost,

  getConnectString,
  resetTestDbAndTestRole,
};
