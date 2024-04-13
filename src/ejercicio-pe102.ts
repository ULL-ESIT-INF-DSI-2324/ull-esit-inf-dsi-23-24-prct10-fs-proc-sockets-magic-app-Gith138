import fs from 'fs';

/**
 * Elimina una carta de la colección.
 * @param {number} id - El ID de la carta a eliminar.
 * @param {string} usuario - El nombre del usuario.
 * @param {function} callback - La función de retorno de llamada que se ejecutará después de eliminar la carta.
 */

export function EliminarCarta(id: number, usuario: string, callback: (err: string | undefined, mensaje: string | undefined) => void) {
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

// Ejemplo de uso:
EliminarCarta(2000, 'jovanie', (err: string | undefined, mensaje: string | undefined) => {
  if (err) {
      console.error((err));
  } else {
      console.log((mensaje));
  }
});
