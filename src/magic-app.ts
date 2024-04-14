import chalk from 'chalk';

/**
 * Enumeración de los colores de las cartas.
 */
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
  
  /**
   * Representa una carta del juego.
   */
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


/**
 * Muestra los detalles de una carta.
 * @param carta - La carta a mostrar.
 */
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
