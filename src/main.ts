import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ColeccionCartas } from './cartas.js';
import { Cartas, Color, Tipo, Rareza } from './magic-app.js';
import net from 'net';

const cliente = net.connect({ port: 60300 });

/**
  * Comando para añadir una carta a la colección.
 */
let argv = yargs(hideBin(process.argv))
  .command(
    'add',
    'Añade una carta a la colección',
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
      nombre: {
        describe: 'Nombre de la carta',
        demandOption: true,
        type: 'string'
      },
      coste_mana: {
        description: 'Coste de maná',
        type: 'number',
        demandOption: true,
      },
      color: {
        description: 'Color de la carta',
        type: 'string',
        choices: ['Blanco', 'Azul', 'Negro', 'Rojo', 'Verde', 'Incoloro', 'Multicolor'],
        demandOption: true,
      },
      tipo: {
        description: 'Tipo de la carta',
        type: 'string',
        choices: ['Tierra', 'Criatura', 'Encantamiento', 'Conjuro', 'Instantaneo', 'Artefacto', 'Planeswalker'],
        demandOption: true,
      },
      rareza: {
        description: 'Rareza de la carta',
        type: 'string',
        choices: ['Comun', 'Infrecuente', 'Rara', 'Mitica'],
        demandOption: true,
      },
      texto_reglas: {
        description: 'Texto de reglas de la carta',
        type: 'string',
        demandOption: true,
      },
      fuerza_resistencia: {
        description: 'Fuerza/Resistencia de la carta (solo para criaturas)',
        type: 'array',
        coerce: (arg) => arg.map(Number),
      },
      marcas_lealtad: {
        description: 'Marcas de lealtad de la carta (solo para planeswalkers)',
        type: 'number',
      },
      valor_mercado: {
        description: 'Valor de mercado de la carta',
        type: 'number',
        demandOption: true,
      },
    },
    (argv) => {
      if (argv.tipo === 'Criatura' && argv.fuerza_resistencia === undefined) {
        throw new Error('Criatura necesito el atributo de fuerza/resistencia');
      }
      if (argv.tipo === 'Planeswalker' && argv.marcas_lealtad === undefined) {
        throw new Error('Planeswalker necesita la marca de lealtad');
      }
      const cartas: Cartas = new Cartas(
        argv.id,
        argv.nombre,
        argv.coste_mana,
        argv.color as unknown as Color,
        argv.tipo as unknown as Tipo,
        argv.rareza as unknown as Rareza,
        argv.texto_reglas,
        argv.valor_mercado,
        argv.fuerza_resistencia,
        argv.marcas_lealtad,
      );
      const info = JSON.stringify({ accion: 'añadir',  carta: cartas, usuario: argv.usuario, fin: 'FIN' });
      cliente.write(info);
    },
  )
.help().argv;

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

  let wholeData = '';
  cliente.on('data', (dataChunk) => {
  wholeData += dataChunk;
  });


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
      cliente.ListarCartas(argv.usuario);
    },
  ) 
.help().argv;

/**
 * Comando para eliminar una carta de la colección.
 */
argv = yargs(hideBin(process.argv))
  .command(
    'delete',
    'Elimina una carta de la colección',
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
      cliente.EliminarCarta(argv.id, argv.usuario);
    },
  )
.help().argv;

/**
 * Comando para actualizar una carta de la colección.
 */
argv = yargs(hideBin(process.argv))
  .command(
    'update',
    'Actualiza una carta a la colección',
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
      nombre: {
        describe: 'Nombre de la carta',
        demandOption: true,
        type: 'string'
      },
      coste_mana: {
        description: 'Coste de maná',
        type: 'number',
        demandOption: true,
      },
      color: {
        description: 'Color de la carta',
        type: 'string',
        choices: ['Blanco', 'Azul', 'Negro', 'Rojo', 'Verde', 'Incoloro', 'Multicolor'],
        demandOption: true,
      },
      tipo: {
        description: 'Tipo de la carta',
        type: 'string',
        choices: ['Tierra', 'Criatura', 'Encantamiento', 'Conjuro', 'Instantaneo', 'Artefacto', 'Planeswalker'],
        demandOption: true,
      },
      rareza: {
        description: 'Rareza de la carta',
        type: 'string',
        choices: ['Comun', 'Infrecuente', 'Rara', 'Mitica'],
        demandOption: true,
      },
      texto_reglas: {
        description: 'Texto de reglas de la carta',
        type: 'string',
        demandOption: true,
      },
      fuerza_resistencia: {
        description: 'Fuerza/Resistencia de la carta (solo para criaturas)',
        type: 'array',
        coerce: (arg) => arg.map(Number),
      },
      marcas_lealtad: {
        description: 'Marcas de lealtad de la carta (solo para planeswalkers)',
        type: 'number',
      },
      valor_mercado: {
        description: 'Valor de mercado de la carta',
        type: 'number',
        demandOption: true,
      },
    },
    (argv) => {
      if (argv.tipo === 'Criatura' && argv.fuerza_resistencia === undefined) {
        throw new Error('Criatura necesito el atributo de fuerza/resistencia');
      }
      if (argv.tipo === 'Planeswalker' && argv.marcas_lealtad === undefined) {
        throw new Error('Planeswalker necesita la marca de lealtad');
      }
      const cartas: Cartas = new Cartas(
        argv.id,
        argv.nombre,
        argv.coste_mana,
        argv.color as unknown as Color,
        argv.tipo as unknown as Tipo,
        argv.rareza as unknown as Rareza,
        argv.texto_reglas,
        argv.valor_mercado,
        argv.fuerza_resistencia,
        argv.marcas_lealtad,
      );
      cliente.ActualizarCarta(cartas, argv.usuario);
    },
  )
.help().argv;
