import "mocha";
import { expect } from "chai";
import { EliminarCarta } from "../src/ejercicio-pe102.js";
import fs from 'fs';

describe("EliminarCarta tests", () => {
    it("EliminarCarta deberia borrar la carta", (done) => {
      // Simular la existencia de la carta
      const id = 21;
      const usuario = "jovanie";
      fs.writeFileSync(`./cartas/${usuario}/${id}.json`, "contenido de la carta");
  
      EliminarCarta(id, usuario, (err, mensaje) => {
        if (!err) {
          // Verificar que la carta se haya eliminado correctamente
          expect(fs.existsSync(`./cartas/${usuario}/${id}.json`)).to.be.false;
          done();
        }
      });
    });
  
    it("EliminarCarta deberia mostrar un error de que no existe la carta", (done) => {
      // Intentar eliminar una carta que no existe
      const id = 2000;
      const usuario = "pez";
  
      EliminarCarta(id, usuario, (err, mensaje) => {
        if (err) {
          // Verificar que se reciba un mensaje de error apropiado
          expect(err).to.be.equal(`La carta no existe en la colección de ${usuario}!`);
          done();
        }
      });
    });
    it("EliminarCarta deberia borrar la carta", (done) => {
      // Simular la existencia de la carta
      const id = 5;
      const usuario = "jovanie";
      fs.writeFileSync(`./cartas/${usuario}/${id}.json`, "contenido de la carta");
  
      EliminarCarta(id, usuario, (err, mensaje) => {
        if (!err) {
          // Verificar que la carta se haya eliminado correctamente
          expect(fs.existsSync(`./cartas/${usuario}/${id}.json`)).to.be.false;
          done();
        }
      });
    });
  });