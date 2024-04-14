import fs from 'fs';
import { Cartas } from './magic-app.js';

export class ColeccionCartas {
	private coleccion: Cartas[] = [];
    /**
     * Agrega una carta a la colección.
     * @param {Object} carta - La carta a agregar.
     * @param {string} usuario - El nombre del usuario.
     * @param {function} callback - La función de retorno de llamada que se ejecutará después de agregar la carta.
     */
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
    }


    /**
     * Actualiza una carta en la colección.
     * @param {Object} carta - La carta actualizada.
     * @param {string} usuario - El nombre del usuario.
     * @param {function} callback - La función de retorno de llamada que se ejecutará después de actualizar la carta.
     */
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


	/**
	 * Elimina una carta de la colección.
	 * @param id - El ID de la carta a eliminar.
	 * @param usuario - El nombre del usuario.
	 */
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

    /**
     * Lista las cartas de un usuario.
     * @param {string} usuario - El nombre del usuario.
     * @param {function} callback - La función de retorno de llamada que se ejecutará después de listar las cartas.
     */
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


    /**
     * Muestra los detalles de una carta.
     * @param {number} id - El ID de la carta.
     * @param {string} usuario - El nombre del usuario.
     * @param {function} callback - La función de retorno de llamada que se ejecutará después de mostrar la carta.
     */
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

}