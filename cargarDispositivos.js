import { connection, conectarDB } from './dbConnection.js';
conectarDB()

// Consulta SQL para obtener los dispositivos disponibles
const sqlQuery = "SELECT CONCAT(marca, ' ', modelo) AS dispositivo FROM dispositivos WHERE idSerial NOT IN (SELECT idSerial FROM asignaciones)";

connection.query(sqlQuery, (error, results, fields) => {
  if (error) {
    console.error('Error al obtener los dispositivos disponibles:', error);
    return;
  }
  console.log('Dispositivos disponibles:', results);
});

connection.end();
