import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaReservas = path.join(__dirname, 'data', 'reservas.json');
const contenidoReservas = fs.readFileSync(rutaReservas, 'utf-8');
const reservas = JSON.parse(contenidoReservas);
const nuevaReserva = {
  fecha: '2026-01-10',
  tipo: 'aula informática',
  unidades: 1,
  precio: 50
};
reservas.push(nuevaReserva);
console.log(reservas);

const app = express();
app.use(express.urlencoded({ extended: true }))
const PORT = 3000;

const rutaPublic = path.join(__dirname, '../public');

app.use(express.static(rutaPublic));

console.log("Carpeta estática registrada:", rutaPublic);

app.get('/saludo', (req, res) => {
    res.send('Hola desde el servidor Express');
});

app.post("/login", (req, res) => {
    const usuarioCorrecto = "profe@example.com";
    const passwordCorrecta = "1234";

    const usuarioCorrecto1 = "fede@fede.com";
    const passwordCorrecta1 = "321";

    console.log(req.body);

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.send("Faltan datos en el formulario.");
        return;
    }

    // Comprobamos usuario 1
    if (email === usuarioCorrecto && password === passwordCorrecta) {
        res.send("Bienvenido, has iniciado sesión correctamente.");
        return;
    }
    
    // Comprobamos usuario 2 (fede)
    if (email === usuarioCorrecto1 && password === passwordCorrecta1) {
        res.send("Bienvenido Federico, has iniciado sesión correctamente.");
        return;
    }

    // Gestión de errores detallada 
    if (email !== usuarioCorrecto && password === passwordCorrecta) {
        res.send("Usuario incorrecto.");
    } else if (email === usuarioCorrecto && password !== passwordCorrecta) {
        res.send("Contraseña incorrecta.");
    } else {
        res.send("Usuario y contraseña incorrectos.");
    }
});


app.post("/reserva", (req, res) => {
    const fechaClase = req.body.fechaClase;
    const tipoClase = req.body.tipoClase;
    const asistentes = req.body.asistentes;

    // Comprobación de campos obligatorios
    if (!fechaClase || !tipoClase || !asistentes) {
        res.send("Faltan datos obligatorios en la reserva.");
        return;
    }

    // Validación numérica
    if (Number(asistentes) <= 0) {
        res.send("El número de asistentes debe ser mayor que cero.");
        return;
    }

    // Validación de selección de clase
    if (Number(tipoClase) == 0) {
        res.send("Debes seleccionar una clase válida.");
        return;
    }

    res.send("Reserva registrada correctamente.");
});

app.post("/resumen", (req, res) => {
    const { fechaClase, tipoClase, asistentes } = req.body;

    // 1. Validación de existencia de datos (El servidor comprueba que llega información)
    if (!fechaClase || !tipoClase || !asistentes) {
        res.send("Error de flujo: No se han recibido datos de reserva. No puedes acceder al resumen directamente.");
        return;
    }

    // 2. Validación de lógica de negocio (asistentes positivos, clase seleccionada)
    if (Number(asistentes) <= 0 || Number(tipoClase) == 0) {
        res.send("Error en los datos: La reserva no es válida.");
        return;
    }

    // 3. Si todo es correcto, el servidor "autoriza" la vista y envía el archivo
    res.sendFile(path.join(rutaPublic, 'resumen.html'));
});



app.use((req, res) => {
    res.status(404).send('Error 404: página no encontrada');
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
