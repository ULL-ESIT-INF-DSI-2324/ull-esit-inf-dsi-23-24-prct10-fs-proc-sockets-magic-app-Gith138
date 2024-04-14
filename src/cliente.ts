import readline from 'readline';
import net from 'net';

const client = new net.Socket();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Conectar al servidor
client.connect(3000, 'localhost', () => {
  console.log('Conectado al servidor');

  // Leer comandos desde la línea de comandos
  rl.on('line', (input) => {
    // Parsear el comando ingresado
    const [command, ...args] = input.trim().split(' ');

    // Crear mensaje a enviar al servidor
    const message = {
      command: command,
      args: args
    };

    // Enviar mensaje al servidor
    client.write(JSON.stringify(message) + '\n');
  });
});

// Evento cuando se recibe una respuesta del servidor
client.on('data', (data) => {
  console.log('Respuesta del servidor:', data.toString().trim());
});

// Evento cuando se cierra la conexión con el servidor
client.on('close', () => {
  console.log('Conexión cerrada');
});
