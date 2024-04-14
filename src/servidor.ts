import { ColeccionCartas } from './cartas.js';
import { Cartas } from './magic-app.js';
import { EventEmitter } from 'events';
import net from 'net';

export class EventEmitterSocket extends EventEmitter {
    /**
    * Constructor de la clase EventEmitterSocket.
    * @param connection La conexión EventEmitter asociada.
    */
   constructor(connection: EventEmitter) {
     super();
     let wholeData = '';
     connection.on('data', (dataChunk) => {
       wholeData += dataChunk;
 
       if (wholeData.includes('FIN"}')) {
         this.emit('peticion', JSON.parse(wholeData), connection);
       }
     });
 
     connection.on('close', () => {
       this.emit('close');
     });
   }
 }
 
 const coleccion = new ColeccionCartas();
 
 const server = net.createServer((connection) => {
   console.log('Un cliente se ha conectado.');
 
   const serverSocket = new EventEmitterSocket(connection);
 
   serverSocket.on('peticion', (peticion, connection) => {
     let carta: Cartas;
     if (peticion.accion === 'añadir' || peticion.accion === 'actualizar') {
       carta = new Cartas (
         peticion.carta.id,
         peticion.carta.nombre,
         peticion.carta.coste_mana,
         peticion.carta.color,
         peticion.carta.tipo,
         peticion.carta.rareza,
         peticion.carta.texto_reglas,
         peticion.carta.valor_mercado,
         peticion.carta.fuerza_resistencia,
         peticion.carta.marcas_lealtad,
       );
     }
 
     console.log('Solicitud recibida: ', peticion.accion);
     switch (peticion.accion) {
       case 'añadir':
         coleccion.AyadirCarta( carta!, peticion.usuario, (error, resultado) => {
           if (error) {
             connection.write(JSON.stringify({ tipo: 'Error', respuesta: error }));
           } else {
             connection.write(JSON.stringify({ tipo: 'Success', respuesta: resultado }));
           }
           connection.end();
         });
         break;
       case 'actualizar':
         coleccion.ActualizarCarta( carta!, peticion.usuario, (error, resultado) => {
           if (error) {
             connection.write(JSON.stringify({ tipo: 'Error', respuesta: error }));
           } else {
             connection.write(JSON.stringify({ tipo: 'Success', respuesta: resultado }));
           }
           connection.end();
         });
         break;
       case 'eliminar':
         coleccion.EliminarCarta(peticion.id, peticion.usuario, (error, resultado) => {
           if (error) {
             connection.write(JSON.stringify({ tipo: 'Error', respuesta: error }));
           } else {
             connection.write(JSON.stringify({ tipo: 'Success', respuesta: resultado }));
           }
           connection.end();
         });
         break;
       case 'listar':
         coleccion.ListarCartas(peticion.usuario, (error, resultado) => {
           if (error) {
             connection.write(JSON.stringify({ tipo: 'Error', respuesta: error }));
           } else {
             connection.write(JSON.stringify({ tipo: 'SuccessCartas', respuesta: resultado }));
           }
           connection.end();
         });
         break;
       case 'mostrar':
         coleccion.MostrarCarta(peticion.id, peticion.usuario, (error, resultado) => {
           if (error) {
             connection.write(JSON.stringify({ tipo: 'Error', respuesta: error }));
           } else {
             connection.write(JSON.stringify({ tipo: 'SuccessCarta', respuesta: resultado }));
           }
           connection.end();
         });
         break;
       default:
         connection.write(console.log('Accion invalida'));
         connection.end();
     }
   });
 
   serverSocket.on('close', () => {
     console.log('Un cliente se ha desconectado');
   });
 });
 
 server.listen(60300, () => {
   console.log('Esperando que los clientes se conecten.');
 });