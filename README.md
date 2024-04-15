[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/7bX30zK4)    
[![Coverage Status](https://coveralls.io/repos/github/Gith138/practica11-modi-dsi/badge.svg?branch=main)](https://coveralls.io/github/Gith138/practica11-modi-dsi?branch=main)    [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-Gith138&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-Gith138)
# Práctica 10 - Aplicación cliente-servidor para coleccionistas de cartas Magic
  
Godgith John alu0101463858@ull.edu.es  

# Informe

### Introducción    
En esta práctica hay que aplicar todo lo aprendido relacionado con typescript y el diseño orientado a objetos.
Hay que implementar una aplicación que permita almacenar información de una colección de cartas Magic de un usuario concreto. En concreto, el sistema permitirá añadir, modificar, eliminar, listar y leer la información asociada a dichas cartas, usando los paquetes `yargs` y `chalk`. En este caso se debe implementar el uso de `cliente y servidor` usando los `sockets` que proporciona el **módulo Net** de **Node.js**. 

### Objetivos a lograr realizando esta práctica
Aprender más acerca de los paquetes de  `yargs` y `chalk`, respetar los **Principios SOLID**, seguir la metodología `TDD` o `BDD` que implica confirmar el correcto funcionamiento del código desarrollado, probar en los casos de que el código de un error porque la entrada no sea correcta(_errors should never pass silently_) y aprender a usar la clase [`EventEmitter`](https://nodejs.org/docs/latest/api/events.html) del módulo Events de Node.js.

Los paquetes:
- `Yargs`
  Yargs es un módulo de análisis de líneas de comandos para Node.js. Permite crear herramientas de línea de comandos interactivas y fáciles de usar.
  ```ts
  npm i yargs
  npm i --save-dev @types/yargs
  ```
  
- `Chalk`
  Chalk es un módulo para dar estilos y colores a la salida de texto en la consola de Node.js.
  Para instalarlo:
  ```ts
  npm i chalk
  ```
Se debe instalar el `c8` para usar el módulo:
```ts
npm i --save-dev c8
```
- `EventEmitter`    
El EventEmitter es un módulo en Node.js que permite la implementación del patrón de diseño de **observador/emisor** de eventos. Funciona de la siguiente manera:
  - **Creación de un EventEmitter:** Primero, importas el módulo events de Node.js y creas una instancia de EventEmitter.
  - **Registro de Eventos y Listeners:** Puedes registrar eventos y sus correspondientes listeners. Un evento puede tener múltiples listeners.
  -**Emisión de Eventos**: Cuando ocurre un evento específico, puedes emitir ese evento junto con cualquier dato que quieras pasar a los listeners.
  - **Manejo de Eventos**: Los listeners asociados a un evento específico se activan cuando se emite ese evento. Cada listener maneja el evento de acuerdo a su lógica interna.
  
### Ejercicios y su explicación
### Descripción de los requisitos de la aplicación
### magic-app
Aqui implemento distintos interfaces para poder describir los distintos elementos:
```ts

export enum Color {
  Blanco = "Blanco",
  Azul = "Azul",
  Negro = "Negro",
  Rojo = "Rojo",
  Verde = "Verde",
  Incoloro = "Incoloro",
  Multicolor = "Multicolor"
}

/**
 * Enumeración de los tipos de las cartas.
 */
export enum Tipo {
  Tierra = "Tierra",
  Criatura = "Criatura",
  Encantamiento = "Encantamiento",
  Conjuro = "Conjuro",
  Instantaneo = "Instantaneo",
  Artefacto = "Artefacto",
  Planeswalker = "Planeswalker"
}

/**
 * Enumeración de las rarezas de las cartas.
 */
export enum Rareza {
  Comun = "Comun",
  Infrecuente = "Infrecuente",
  Rara = "Rara",
  Mitica = "Mitica"
}
```
Después implemento una clase donde creo una instancia los distintos elementos:
```ts
export class Cartas {
  /**
   * Crea una instancia de la clase Cartas.
   * @param id - El identificador de la carta.
   * @param nombre - El nombre de la carta.
   * @param coste_mana - El coste de mana de la carta.
   * @param color - El color de la carta.
   * @param tipo - El tipo de la carta.
   * @param rareza - La rareza de la carta.
   * @param texto_reglas - El texto de las reglas de la carta.
   * @param valor_mercado - El valor de mercado de la carta.
   * @param fuerza_resistencia - La fuerza y resistencia de la carta (solo para cartas de tipo Criatura).
   * @param marcas_lealtad - Las marcas de lealtad de la carta (solo para cartas de tipo Planeswalker).
   */
  constructor( public id: number, public nombre: string, public coste_mana: number, public color: Color, public tipo: Tipo, public rareza: Rareza, public texto_reglas: string, public valor_mercado: number, public fuerza_resistencia?: [number, number], public marcas_lealtad?: number) {
    this.id = id;
    this.nombre = nombre;
    this.coste_mana = coste_mana;
    this.color = color;
    this.tipo = tipo;
    this.rareza = rareza;
    this.texto_reglas = texto_reglas;
    this.valor_mercado = valor_mercado;
    if (tipo === Tipo.Criatura) {
      this.fuerza_resistencia = fuerza_resistencia;
    }
    if (tipo === Tipo.Planeswalker) {
      this.marcas_lealtad = marcas_lealtad;
    }
  }
}
```
Y también creo una función donde muestro los detalles de una carta, con los colores correspondientes y el formato requerido, usando el paquete de `Yargs`:
```ts
export function MostrarCartas(carta: string): void {
    const carta_json = JSON.parse(carta); // Convertir el string a JSON
    let resultado = '';
    resultado += `Id: ${carta_json.id}\n`;
    resultado += `Nombre: ${carta_json.nombre}\n`;
    resultado += `Coste de maná: ${carta_json.coste_mana}\n`;
    resultado += `Color: ${carta_json.color}\n`;
    resultado += `Linea de tipo: ${carta_json.tipo}\n`;
    resultado += `Rareza: ${carta_json.rareza}\n`;
    resultado += `Texto de reglas: ${carta_json.texto_reglas}\n`;
    if (carta_json.tipo === 'Criatura') { // Mostrar la fuerza y resistencia de la criatura
        resultado += `Fuerza/Resistencia: ${carta_json.fuerza_resistencia}\n`;
    }
    if (carta_json.tipo === 'Planeswalker') { // Mostrar las marcas de lealtad del planeswalker
        resultado += `Marcas de lealtad: ${carta_json.marcas_lealtad}\n`;
    }
    resultado += `Valor de mercado: ${carta_json.valor_mercado}\n`;

    switch (carta_json.color) { // Mostrar el color de la carta
        case 'Blanco':
            console.log(chalk.white(resultado));
            break;
        case 'Azul':
            console.log(chalk.blue(resultado));
            break;
        case 'Negro':
            console.log(chalk.black(resultado));
            break;
        case 'Rojo':
            console.log(chalk.red(resultado));
            break;
        case 'Verde':
            console.log(chalk.green(resultado));
            break;
        case 'Incoloro':
            console.log(chalk.gray(resultado));
            break;
        case 'Multicolor':
            console.log(chalk.yellow(resultado));
            break;
        default:
            console.log(chalk.red('No se reconoce el color!'));
            break;
    }
}
```
### cartas
Creo una clase donde declaro los distintos métodos a implementar:

- **Añadir una carta a la colección**. Antes de añadir una carta a la colección se debe comprobar si ya existe una carta con el mismo ID. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola. En caso contrario, se añadirá la nueva carta a la colección y se mostrará un mensaje informativo por la consola y en caso de error seusa el patrón `Callback`, para controlar los errores que se pueden producir:
```ts
    public AyadirCarta(carta: Cartas, usuario: string, callback: (err: string | undefined, mensaje: string | undefined) => void) {
        const directorio_cartas = `./cartas/${usuario}`;
        const RutaCarta = `${directorio_cartas}/${carta.id}.json`;

        if (!fs.existsSync(directorio_cartas)) { // Verificar si no existe el directorio
            fs.mkdir(directorio_cartas, { recursive: true }, (err) => {
                if (err) {
                    callback(`Error al crear el directorio: ${err}`, undefined);
                } else {
                    agregarCarta();
                }
            });
        } else {
            agregarCarta();
        }
        function agregarCarta() {
            if (fs.existsSync(RutaCarta)) { // Verificar si la carta existe
                callback(`La carta ya existe en la colección de ${usuario}!`, undefined);
            } else { // Añadir la carta
                fs.writeFile(RutaCarta, JSON.stringify(carta, undefined, 2), (err) => {
                    if (err) {
                        callback(`Error al añadir la carta: ${err}`, undefined);
                    } else {
                        callback(undefined, `Nueva carta añadida a la colección de ${usuario}!`);
                    }
                });
            }
        }
```

- **Modificar una carta de la colección**. Antes de modificar una carta, previamente se debe comprobar si ya existe una carta con el ID de la carta a modificar en la colección. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola, usando el patrón `Callback`:
```ts
    public ActualizarCarta(carta: Cartas, usuario: string, callback: (err: string | undefined, mensaje: string | undefined) => void) {
        const directorio_cartas = `./cartas/${usuario}`;
        const RutaCarta = `${directorio_cartas}/${carta.id}.json`;

        fs.access(RutaCarta, fs.constants.F_OK, (err) => {
            if (err) { // Si hay un error, significa que la carta no existe
                callback(`La carta no existe en la colección de ${usuario}!`, undefined);
            } else {
                fs.writeFile(RutaCarta, JSON.stringify(carta, undefined, 2), (err) => {
                    if (err) {
                        callback(`Error al actualizar la carta: ${err}`, undefined);
                    } else {
                        callback(undefined, `Carta actualizada en la colección de ${usuario}!`);
                    }
                });
            }
        });
    }
```

- **Eliminar una carta de la lista**. Antes de eliminar una carta, previamente se debe comprobar si existe una carta con el ID de la carta a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola, usando el patrón `Callback`:
```ts
    public EliminarCarta(id: number, usuario: string, callback: (err: string | undefined, mensaje: string | undefined) => void) {
        const directorio_cartas = `./cartas/${usuario}`;
        const RutaCarta = `${directorio_cartas}/${id}.json`;
        fs.access(RutaCarta, fs.constants.F_OK, (err) => { // Verificar si la carta existe, usando fs.access con fs.constants.F_OK que es para verificar si el archivo existe.
            if (err) { // Si hay un error, significa que la carta no existe
                callback(`La carta no existe en la colección de ${usuario}!`, undefined);
            } else {
                fs.unlink(RutaCarta, (err) => { // borra la carta existente, sino muestra un error
                    if (err) {
                        callback(`Error al eliminar la carta: ${err}`, undefined);
                    } else {
                        callback(undefined, `Carta eliminada de la colección de ${usuario}!`);
                    }
                });
            }
        });
      }
```
- **Listar las cartas existentes en una colección**. En este caso, deberá mostrarse la información asociada a cada carta existente en la colección por la consola, y en de errores se usa el patrón `Callback`:
```ts
    public ListarCartas(usuario: string, callback: (err: string | undefined, mensaje: string | undefined) => void) {
        const directorio_cartas = `./cartas/${usuario}`;

        fs.access(directorio_cartas, fs.constants.F_OK, (err) => {
            if (err) { // Si hay un error, significa que el usuario no tiene una colección de cartas
                callback(`${usuario} no tiene una colección de cartas`, undefined);
            } else {
                fs.readdir(directorio_cartas, (err, archivos) => {
                    if (err) {
                        callback(`Error al leer la colección de cartas de ${usuario}: ${err}`, undefined);
                    } else {
                        archivos.forEach((archivo) => {
                            fs.readFile(`${directorio_cartas}/${archivo}`, (err, data) => {
                                if (err) {
                                    callback(`Error al leer el archivo ${archivo}: ${err}`, undefined);
                                } else {
                                    callback(undefined, data.toString());
                                }
                            });
                        });
                    }
                });
            }
        });
    }
```

- **Mostrar la información de una carta concreta existente en la colección**. Antes de mostrar la información de la carta, se debe comprobar que en la colección existe una carta cuyo ID sea el de la carta a mostrar. Si existe, se mostrará toda su información. En caso contrario, se mostrará un mensaje de error por la consola, usando el patrón `Callback`:
```ts
    public MostrarCarta(id: number, usuario: string, callback: (err: string | undefined, mensaje: string | undefined) => void) {
        const directorio_cartas = `./cartas/${usuario}`;
        const RutaCarta = `${directorio_cartas}/${id}.json`;

        fs.access(RutaCarta, fs.constants.F_OK, (err) => {
            if (err) { // Si hay un error, significa que la carta no existe
                callback(`Carta no encontrada en la colección de ${usuario}`, undefined);
            } else {
                fs.readFile(RutaCarta, (err, data) => {
                    if (err) {
                        callback(`Error al leer la carta: ${err}`, undefined);
                    } else {
                        callback(undefined, data.toString());
                    }
                });
            }
        });
    }
```
### Servidor
Implemento una clase `EventEmitterSocket` que extiende `EventEmitter`. Se usa para gestionar la comunicación entre el servidor y los clientes mediante eventos. 
Primero defino la clase `EventEmitterSocket`, que hereda de `EventEmitter`. El constructor recibe una conexión `EventEmitter` como parámetro. Se establecen dos listeners de eventos: uno para el evento `data` y otro para el evento `close`. Cuando llegan datos (`data`) a través de la conexión, se van acumulando en `wholeData`. Cuando se detecta que se ha recibido un mensaje completo (identificado por la cadena **FIN**), se emite un evento `peticion` con los datos recibidos y la conexión asociada. Cuando la conexión se cierra (`close`), se emite un evento `close`:
```ts
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
```
Ahora creo un servidor TCP utilizando `net.createServer()`. Cuando un cliente se conecta, se imprime un mensaje y se instancia un `EventEmitterSocket` asociado a la conexión del cliente. Luego, se establecen dos listeners de eventos en el `EventEmitterSocket`: uno para el evento `peticion` y otro para el evento `close`. Cuando se emite un evento `peticion`, se manejan las peticiones del cliente. Cuando se emite un evento `close`, se imprime un mensaje indicando que un cliente se ha desconectado:
```ts
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
  });
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
        //demás operaciones
  }
  serverSocket.on('close', () => {
    console.log('Un cliente se ha desconectado');
  });
});

server.listen(60300, () => {
  console.log('Esperando que los clientes se conecten.');
});
```
### Cliente    
En el cliente se establece una conexión TCP con un servidor en el puerto 60300:
```ts
const cliente = net.connect({ port: 60300 });
```
Defino diferentes comandos (**add, show, list, delete, update**) utilizando la librería **yargs**.
Cada comando especifica los argumentos necesarios para su ejecución, como el nombre del usuario, el ID de la carta, etc.
Ahora especifico funciones de callback que se ejecutarán cuando se invoque cada comando.
```ts
let argv = yargs(hideBin(process.argv))
  .command(
/**
 * Comando para mostrar una carta de la colección.
 */ 
argv = yargs(hideBin(process.argv))
  .command(
    'show',
    'Muestra una carta de la colección',
    {
      usuario: {
        describe: 'Nombre de usuario',
        demandOption: true,
        type: 'string'
      },
      id: {
        describe: 'ID de la carta',
        demandOption: true,
        type: 'number'
      },
    },
    (argv) => {
      const info = JSON.stringify({ accion: 'mostrar',  id: argv.id, usuario: argv.usuario, fin: 'FIN' });
      cliente.write(info);
    },
  )
.help().argv;

/**
 * Comando para listar todas las cartas de la colección.
 */ 
argv = yargs(hideBin(process.argv))
  .command(
    'list',
    'Muestra todas las cartas de la colección',
    {
      usuario: {
        describe: 'Nombre de usuario',
        demandOption: true,
        type: 'string'
      },
    },
    (argv) => {
      const info = JSON.stringify({ accion: 'listar', usuario: argv.usuario, fin: 'FIN' });
      cliente.write(info);
    },
  ) 
.help().argv;
//
```

Defino un listener en el cliente TCP para el evento  `data`. Los datos recibidos del servidor se concatenan en la variable wholeData.
```ts
cliente.on('data', (dataChunk) => {
  wholeData += dataChunk;
});
```
Defino un `listener` para los eventos `end` y `close` del cliente TCP. Cuando se recibe el evento `end`, se parsea la respuesta del servidor y se realiza una acción basada en el tipo de respuesta recibida (**Error, Success, SuccessCartas, SuccessCarta**), dependiendo del tipo de respuesta, se muestra un mensaje en la consola utilizando la librería `chalk`:
```ts
cliente.on('end', () => {
  // Manejo de la respuesta del servidor para el evento 'end'
});
  
cliente.on('close', () => {
  console.log('Conexion cerrada');
});
```
### Modificación
Como modificación se pidió realizar una de las operaciones de las cartas mágicas, usando el patrón `Callback`, para así controlar mejor los errores.
En mi caso lo hice de la operación de eliminar cartas:
```ts
    function EliminarCarta(id: number, usuario: string, callback: (err: string | undefined, mensaje: string | undefined) => void) {
        const directorio_cartas = `./cartas/${usuario}`;
        const RutaCarta = `${directorio_cartas}/${id}.json`;
        fs.access(RutaCarta, fs.constants.F_OK, (err) => { // Verificar si la carta existe, usando fs.access con fs.constants.F_OK que es para verificar si el archivo existe.
            if (err) { // Si hay un error, significa que la carta no existe
                callback(`La carta no existe en la colección de ${usuario}!`, undefined);
            } else {
                fs.unlink(RutaCarta, (err) => { // borra la carta existente, sino muestra un error
                    if (err) {
                        callback(`Error al eliminar la carta: ${err}`, undefined);
                    } else {
                        callback(undefined, `Carta eliminada de la colección de ${usuario}!`);
                    }
                });
            }
        });
      }
```
Esta función elimina un archivo de una carta específica del sistema de archivos(json) y notifica al usuario sobre el resultado de la operación a través de una función de devolución de llamada, es decir, usando `Callback`.
### Dificultades      
Esta práctica ha sido complicada, porque me ha resultado difícil entender bien el funcionamiento de los distintos paquetes y como usar el `Módulo Net`

### Bibliografía
- [Yargs](https://www.npmjs.com/package/yargs)
- [Chalk](https://www.npmjs.com/package/chalk)
- [node.js](https://nodejs.org/docs/latest/api/fs.html)
- [Modulo fs Node.js](https://nodejs.org/docs/latest/api/fs.html)
- [Módulo Net Node.js](https://nodejs.org/docs/latest/api/net.html)
  
Grado de Ingeniería Informática    
Godgith John    
Desarrollo de Sistemas Informáticos	    
Práctica 10 - Aplicación cliente-servidor para coleccionistas de cartas Magic
