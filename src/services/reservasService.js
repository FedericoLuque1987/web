import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaReservas = path.join(__dirname, '../data/reservas.json');

export function leerReservas() {
    const contenido = fs.readFileSync(rutaReservas, 'utf-8');
    return JSON.parse(contenido);
}

export function guardarReservas(reservas, callback) {
    const texto = JSON.stringify(reservas, null, 2);
    fs.writeFile(rutaReservas, texto, (error) => {
        if (error) {
            console.log('Error al guardar las reservas');
        } else {
            console.log('Reservas guardadas correctamente');
        }
        if (callback) callback(error);
    });
}
