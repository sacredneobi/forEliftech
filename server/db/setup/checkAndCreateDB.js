const def = async (db) => {
  const {
    database,
    username,
    password,
    port = 5432,
    host,
    dialect,
    encoding,
    locale,
  } = process.setting?.db ?? {};
  console.done(["CHECK", "CREATE DB"], database);

  if (
    dialect === "postgres" &&
    database &&
    username &&
    password &&
    port &&
    host
  ) {
    const { Client, defaults } = require("pg");

    const client = new Client({
      ...defaults,
      user: username,
      database: "postgres",
      password,
      port,
      host,
      client_encoding: locale ?? "en_US.utf8",
    });

    try {
      await client.connect();
      const data = await client.query(
        `SELECT datname FROM pg_database where datname = '${database}'`
      );

      if (data.rowCount === 0) {
        await client.query(
          `CREATE DATABASE ${database} ${locale ? `'LOCALE ${locale}'` : ""} ${
            encoding ? `ENCODING ${encoding}` : ""
          } TEMPLATE template0`
        );

        try {
          await client.query("CREATE EXTENSION pgcrypto;");
        } catch (err) {
          console.log(err?.message);
        }

        console.log(
          "CREATE DB",
          database,
          "OK",
          "ENCODING",
          encoding ?? "UTF8",
          "LOCAL",
          locale ?? "en_US.utf8"
        );
      }
      client.end();
    } catch (err) {
      client.end();
      console.error("CREATE DB", err);
      process.exit(1);
    }
  }
};

module.exports = def;
