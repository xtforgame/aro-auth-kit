/* eslint-disable quotes, no-multi-str, max-len */
import fs from 'fs';
import pg from 'pg';

// import az_pgdef_lib from './az_pgdef_lib';

if (process.platform === 'linux') {
  console.log(process.env.POSTGRESQL_PORT_5432_TCP_ADDR);
  console.log(process.env.POSTGRESQL_PORT_5432_TCP_PORT);
}


export class ErrorTypes {
  static Connection = "connection";
  static Readfile = "readfile";
  static Query = "query";
}

export class ConnectionState {
  static Connecting = "connecting";
  static Connected = "connected";
  static Disconnecting = "disconnecting";
  static Disconnected = "disconnected";
}

function read_file_promise(file, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (error, data) => {
      if (error) {
        // reject(new Error(error));
        reject({ error_type: ErrorTypes.Readfile, error });
      } else {
        resolve(data);
      }
    });
  });
}

export class AzPgClient {
  constructor(con_str) {
    this.client = null;
    this.con_str = con_str;
    this.connection_state = ConnectionState.Disconnected;
  }

  connect(con_str) {
    if (con_str) {
      this.con_str = con_str;
    }

    this.connection_state = ConnectionState.Connecting;

    const This = this;
    this.client = new pg.Client(this.con_str);

    this.client.on('error', (error) => {
      if (error.code === "ECONNRESET") {
        // For https://github.com/brianc/node-postgres/issues/599
        // console.error("Catch ECONNRESET !!!");
      } else if (error.code === "57P01") {
        // For https://github.com/brianc/node-postgres/issues/821
        console.error("Catch 57P01 !!!");
      } else {
        console.error("Catch uncaughtException pg err !!!");
        throw error;
      }
      try {
        This.disconnect();
      } catch (e) { // eslint-disable-line no-unused-vars
      }
    });

    return new Promise((resolve, reject) => {
      this.client.connect((error) => {
        if (error) {
          // console.error('could not connect to postgres', error);
          // reject(new Error(error));
          this.connection_state = ConnectionState.Disconnected;
          reject({ client: this, error_type: ErrorTypes.Connection, error });
        } else {
          this.connection_state = ConnectionState.Connected;
          resolve({ client: this, result: this });
        }
      });
    });
  }

  disconnect() {
    if (this.client) {
      const temp = this.client;
      this.client = null;
      temp.end();
    }
    this.connection_state = ConnectionState.Disconnected;
  }

  end() {
    return this.disconnect();
  }

  query(...args) {
    return this.client.query(...args);
  }

  query_promise(query_text) {
    return new Promise((resolve, reject) => {
      this.client.query(query_text, (error, result) => {
        if (error) {
          // reject(new Error(error));
          const near = error.position && error.position >= query_text.length &&
            query_text.substring(
              Math.max(0, error.position - 5),
              Math.min(error.position + 10, query_text.length),
            );
          reject({ client: this, error_type: ErrorTypes.Query, error, near });
        } else {
          resolve({ client: this, result });
        }
      });
    });
  }

  query_from_file_promise(file, encoding) {
    return read_file_promise(file, encoding)
      .then(data => this.query_promise(data))
      .then(result => Promise.resolve(result))
      .catch(error =>
      // return Promise.reject(new Error(error));
        Promise.reject(error));
  }
}

class AzPg {
  constructor() {
    this.read_file_promise = read_file_promise;
  }

  create_connection(con_str) {
    return new Promise((resolve, reject) => {
      const client = new pg.Client(con_str);

      client.on('error', (error) => {
        if (error.code === "ECONNRESET") {
          // For https://github.com/brianc/node-postgres/issues/599
          console.error("Catch ECONNRESET !!!");
        } else if (error.code === "57P01") {
          // For https://github.com/brianc/node-postgres/issues/821
          console.error("Catch 57P01 !!!");
        } else {
          console.error("Catch uncaughtException pg err !!!");
          throw error;
        }
      });
      client.connect((error) => {
        if (error) {
          // console.error('could not connect to postgres', error);
          // reject(new Error(error));
          reject({ error_type: ErrorTypes.Connection, client, error });
        } else {
          resolve({ client, result: client });
        }
      });
    });
  }

  send_query_promise(client, query_text) {
    return new Promise((resolve, reject) => {
      client.query(query_text, (error, result) => {
        if (error) {
          // reject(new Error(error));
          reject({ error_type: ErrorTypes.Query, client, error });
        } else {
          resolve({ client, result });
        }
      });
    });
  }

  disconnect_all_user(client, dbname) {
    let query_text = "";
    if (dbname) {
      query_text = `SELECT pg_terminate_backend(pg_stat_activity.pid)
                    FROM pg_stat_activity
                    WHERE pg_stat_activity.datname = '${dbname}'
                    AND pid <> pg_backend_pid()`;
    } else {
      query_text = `SELECT pg_terminate_backend(pg_stat_activity.pid)
                    FROM pg_stat_activity
                    WHERE pid <> pg_backend_pid();`;
    }
    return this.send_query_promise(client, query_text);
  }

  send_query_from_file_promise(client, file, encoding) {
    return this.read_file_promise(file, encoding)
      .then(data => this.send_query_promise(client, data))
      .then(result => Promise.resolve(result))
      .catch(error =>
        // return Promise.reject(new Error(error));
        Promise.reject(error));
  }
}

const _AzPg = new AzPg(); // eslint-disable-line no-underscore-dangle


const DB_DEFAULT_SETTINGS = " TEMPLATE template1 ENCODING = 'UTF8' TABLESPACE = pg_default CONNECTION LIMIT = -1";

export {
  DB_DEFAULT_SETTINGS,
};

export function removeRoleAndDb(client, dbName, roleName) {
  return _AzPg.disconnect_all_user(client, dbName)
    .then(result => // eslint-disable-line no-unused-vars
      // console.log("disconnect_all_user result :", result.result);
      _AzPg.send_query_promise(client, `DROP DATABASE IF EXISTS ${dbName};`))
    .then(result => // eslint-disable-line no-unused-vars
      // console.log("P1 result :", result);
      _AzPg.send_query_promise(client, `DROP ROLE IF EXISTS ${roleName};`));
}

export function createRoleAndDb(client, dbName, roleName, rolePassword) {
  return _AzPg.send_query_promise(client, `CREATE ROLE ${roleName} SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION LOGIN PASSWORD '${rolePassword}';`)
    .then(result => // eslint-disable-line no-unused-vars
      // console.log("P1 result :", result);
      _AzPg.send_query_promise(client, `ALTER ROLE ${roleName} VALID UNTIL 'infinity';`))
    .then(result => // eslint-disable-line no-unused-vars
      // console.log("P1 result :", result);
      _AzPg.send_query_promise(client, `CREATE DATABASE ${dbName} OWNER = ${roleName} ${DB_DEFAULT_SETTINGS};`));
}


// Intelligent Management Interface
export class AzPgImi {
  static get_system_state(conn) {
    if (conn instanceof pg.Client) {
      return _AzPg.send_query_promise(conn, "SELECT fn_get_core_env_var('system_state');")
        .then(result =>
          // console.log("system_state :", result.result.rows[0].fn_get_core_env_var);
          ({ client: result.client, system_state: result.result.rows[0].fn_get_core_env_var }))
        .catch(error => Promise.reject({ error, client: conn, system_state: null }));
    } else if (typeof conn === "string") {
      return _AzPg.create_connection(conn)
        .then(result => _AzPg.send_query_promise(result.client, "SELECT fn_get_core_env_var('system_state');"))
        .then(result =>
          // console.log("system_state :", result.result.rows[0].fn_get_core_env_var);
          ({ client: result.client, system_state: result.result.rows[0].fn_get_core_env_var }))
        .catch((error) => {
          if (error.error_type === ErrorTypes.Connection) {
            return Promise.reject({ error, client: null, system_state: null });
          }
          return Promise.reject({ error, client: error.client, system_state: null });
        });
    }
    return Promise.reject({ error: 'no connect string provided' });
  }
}

export default _AzPg;
