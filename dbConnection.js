import mysql from "mysql"


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prueba_cuc'
});

// Función para conectar a la base de datos
function conectarDB() {
  connection.connect(err => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión establecida con la base de datos');
  });
}

// Exportar la conexión y la función para conectar
export { connection, conectarDB };