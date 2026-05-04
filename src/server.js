import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaReservas = path.join(__dirname, 'data', 'reservas.json');
const contenidoReservas = fs.readFileSync(rutaReservas, 'utf-8');
const reservas = JSON.parse(contenidoReservas);

const app = express();
app.use(express.urlencoded({ extended: true }));
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

    if (email === usuarioCorrecto && password === passwordCorrecta) {
        res.send("Bienvenido, has iniciado sesión correctamente.");
        return;
    }

    if (email === usuarioCorrecto1 && password === passwordCorrecta1) {
        res.send("Bienvenido Federico, has iniciado sesión correctamente.");
        return;
    }

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

    if (!fechaClase || !tipoClase || !asistentes) {
        res.send("Faltan datos obligatorios en la reserva.");
        return;
    }

    if (Number(asistentes) <= 0) {
        res.send("El número de asistentes debe ser mayor que cero.");
        return;
    }

    if (Number(tipoClase) == 0) {
        res.send("Debes seleccionar una clase válida.");
        return;
    }

    res.send("Reserva registrada correctamente.");
});

app.post("/resumen", (req, res) => {
    const { fechaClase, tipoClase, asistentes } = req.body;

    if (!fechaClase || !tipoClase || !asistentes) {
        res.send("Error de flujo: No se han recibido datos de reserva. No puedes acceder al resumen directamente.");
        return;
    }

    if (Number(asistentes) <= 0 || Number(tipoClase) == 0) {
        res.send("Error en los datos: La reserva no es válida.");
        return;
    }

    const nuevaReserva = {
        fecha: fechaClase,
        tipo: tipoClase,
        unidades: Number(asistentes),
        precio: Number(tipoClase) * Number(asistentes)
    };

    reservas.push(nuevaReserva);

    const reservasTexto = JSON.stringify(reservas, null, 2);

    fs.writeFile(rutaReservas, reservasTexto, (error) => {
        if (error) {
            console.log('Error al guardar las reservas');
            res.send('Error al guardar la reserva.');
        } else {
            console.log('Reservas guardadas correctamente');
            res.sendFile(path.join(rutaPublic, 'resumen.html'));
        }
    });
});



app.use((req, res) => {
    res.status(404).send('Error 404: página no encontrada');
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
