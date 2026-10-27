const {Client} = require("pg");
const bcrypt = require("bcrypt")

const SQL = `

CREATE TABLE IF NOT EXISTS proveedores (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(200)  NOT NULL,
    email       VARCHAR(255)  UNIQUE,
    telefono    VARCHAR(30),
    direccion   TEXT,
    notas       TEXT,
    activo      BOOLEAN       NOT NULL DEFAULT true,
    creado_en   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );

`


async function main() {
  console.log("Seeding...");

  


  
  const client = new Client({
    connectionString: "postgresql://postgres:samu123@localhost:5432/saju_stock_db",
  });

  await client.connect();

  // Crear tablas
  await client.query(SQL);

  // Generar hash
  const hash = await bcrypt.hash("admin1234", 10);

  // Insertar admin
  await client.query(
    `
    INSERT INTO usuarios
      (nombre, email, password_hash, rol)
    VALUES
      ($1, $2, $3, $4)
    ON CONFLICT (email)
    DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      nombre = EXCLUDED.nombre,
      rol = EXCLUDED.rol,
      activo = true;
    `,
    [
      "Administrador",
      "admin@sajustock.com",
      hash,
      "admin",
    ]
  );

  console.log(" Usuario administrador creado");

  await client.end();

  console.log("Done");
}

main().catch(console.error);