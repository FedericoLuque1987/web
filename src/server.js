import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import Reserva from './models/Reserva.js';
import {
    guardarReserva,
    obtenerReservasPorUsuario,
    actualizarReserva,
    eliminarReserva
} from './services/reservasService.js';
import { requiereAutenticacion } from './middlewares/authMiddleware.js';
import { comprobarConexion } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
comprobarConexion();

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: false
}));
const PORT = 3000;

const rutaPublic = path.join(__dirname, '../public');
const rutaViews = path.join(__dirname, 'views');

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

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.send("Faltan datos en el formulario.");
        return;
    }

    if (email === usuarioCorrecto && password === passwordCorrecta) {
        req.session.autenticado = true;
        req.session.usuario = email;
        res.send("Bienvenido, has iniciado sesión correctamente.");
        return;
    }

    if (email === usuarioCorrecto1 && password === passwordCorrecta1) {
        req.session.autenticado = true;
        req.session.usuario = email;
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

app.get('/reserva', requiereAutenticacion, (req, res) => {
    res.sendFile(path.join(rutaViews, 'reserva.html'));
});

app.post('/reserva', requiereAutenticacion, async (req, res) => {
    try {
        const { fechaClase, tipoClase, asistentes } = req.body;

        if (!fechaClase || !tipoClase || !asistentes) {
            return res.status(400).send('Faltan datos obligatorios en la reserva.');
        }

        if (Number(asistentes) <= 0) {
            return res.status(400).send('El número de asistentes debe ser mayor que cero.');
        }

        if (Number(tipoClase) == 0) {
            return res.status(400).send('Debes seleccionar una clase válida.');
        }

        const usuario = req.session.usuario;
        const precio = Number(tipoClase) * Number(asistentes);

        const nuevaReserva = new Reserva(
            fechaClase,
            tipoClase,
            asistentes,
            precio,
            usuario
        );

        const idGenerado = await guardarReserva(nuevaReserva);

        res.send(`
            <h2>Reserva guardada correctamente en MySQL.</h2>
            <p>Identificador de la reserva: ${idGenerado}</p>
            <p><a href="/reservas">Ver mis reservas</a></p>
        `);
    } catch (error) {
        console.error('Error al guardar la reserva:', error);
        res.status(500).send('Error al guardar la reserva en la base de datos.');
    }
});

app.get('/reservas', requiereAutenticacion, async (req, res) => {
    try {
        const usuario = req.session.usuario;
        const reservas = await obtenerReservasPorUsuario(usuario);
        res.json(reservas);
    } catch (error) {
        console.error('Error al consultar reservas:', error);
        res.status(500).send('Error al consultar las reservas.');
    }
});

app.post('/reservas/actualizar', requiereAutenticacion, async (req, res) => {
    try {
        const { id, fecha, tipo, unidades, precio } = req.body;

        if (!id || !fecha || !tipo || !unidades || !precio) {
            return res.status(400).send('Faltan datos para actualizar la reserva.');
        }

        const usuario = req.session.usuario;

        const reservaActualizada = new Reserva(
            fecha,
            tipo,
            unidades,
            precio,
            usuario
        );

        const filasModificadas = await actualizarReserva(
            id,
            reservaActualizada,
            usuario
        );

        if (filasModificadas === 0) {
            return res.status(404).send(
                'No se ha actualizado ninguna reserva. Puede que no exista o que no pertenezca al usuario autenticado.'
            );
        }

        res.send('Reserva actualizada correctamente.');
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).send('Error al actualizar la reserva.');
    }
});

app.post('/reservas/eliminar', requiereAutenticacion, async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send('Falta el id de la reserva que se quiere eliminar.');
        }

        const usuario = req.session.usuario;
        const filasEliminadas = await eliminarReserva(id, usuario);

        if (filasEliminadas === 0) {
            return res.status(404).send(
                'No se ha eliminado ninguna reserva. Puede que no exista o que no pertenezca al usuario autenticado.'
            );
        }

        res.send('Reserva eliminada correctamente.');
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        res.status(500).send('Error al eliminar la reserva.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send('Error al cerrar la sesión');
        }
        res.send('Sesión cerrada correctamente');
    });
});

app.use((req, res) => {
    res.status(404).send('Error 404: página no encontrada');
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
