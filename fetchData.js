import axios from "axios";
import { connection, conectarDB } from './dbConnection.js';

const apiUrl = 'http://consultas.cuc.edu.co/api/v1.0/articulos';

// Configuración del Header
const config = {
  headers: {
    'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6InBydWViYTIwMjJAY3VjLmVkdS5jbyIsImV4cCI6MTY0OTQ1MzA1NCwiY29ycmVvIjoicHJ1ZWJhMjAyMkBjdWMuZWR1LmNvIn0.MAoFJE2SBgHvp9BS9fyBmb2gZzD0BHGPiyKoAo_uYAQ'
  }
};

// Función para realizar la solicitud GET a la API y guardar los datos en la base de datos
async function fetchData() {
  try {
    conectarDB();
    const response = await axios.get(apiUrl, config);
    const data = response.data;

    // Insertar datos en la base de datos
    for (const item of data) {
      //formateo de fecha de ingreso
      const fechaIngresoAPI = item.fecha_ingreso;
      const partesFechaIngreso = fechaIngresoAPI.split('/');
      const diaIngreso = partesFechaIngreso[0];
      const mesIngreso = partesFechaIngreso[1];
      const anioIngreso = partesFechaIngreso[2];
      const fechaIngresoFormateada = `${anioIngreso}-${mesIngreso < 10 ? '0' : ''}${mesIngreso}-${diaIngreso < 10 ? '0' : ''}${diaIngreso}`;
      //formateo de fecha de garantia
      const fechaGarantiaAPI = item.fecha_garantia;
      const partesFechaGarantia = fechaGarantiaAPI.split('/');
      const diaGarantia = partesFechaGarantia[0];
      const mesGarantia = partesFechaGarantia[1];
      const anioGarantia = partesFechaGarantia[2];
      const fechaGarantiaFormateada = `${anioGarantia}-${mesGarantia < 10 ? '0' : ''}${mesGarantia}-${diaGarantia < 10 ? '0' : ''}${diaGarantia}`;
      await new Promise((resolve, reject) => {
        connection.query('INSERT INTO dispositivos (idSerial, fecha_Ingreso, fecha_Garantia, tipo, marca, modelo) VALUES (?, ?, ?, ?, ?, ?)', [item.serial, fechaIngresoFormateada, fechaGarantiaFormateada, item.tipo, item.marca, item.modelo], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    console.log('Datos insertados en la base de datos correctamente.');
  } catch (error) {
    console.error('Error al obtener los datos de la API o al insertar en la base de datos:', error);
  } finally {
    connection.end();
  }
}

fetchData();