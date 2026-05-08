import { pool } from '../config/db.js';

export async function guardarReserva(reserva) {
    const sql = `
        INSERT INTO reservas (fecha, tipo, unidades, precio, usuario)
        VALUES (?, ?, ?, ?, ?)
    `;

    const valores = [
        reserva.fecha,
        reserva.tipo,
        reserva.unidades,
        reserva.precio,
        reserva.usuario
    ];

    const [resultado] = await pool.execute(sql, valores);

    return resultado.insertId;
}

export async function obtenerReservasPorUsuario(usuario) {
    const sql = `
        SELECT id, fecha, tipo, unidades, precio, usuario
        FROM reservas
        WHERE usuario = ?
        ORDER BY id DESC
    `;

    const [filas] = await pool.execute(sql, [usuario]);

    return filas;
}

export async function actualizarReserva(id, reserva, usuario) {
    const sql = `
        UPDATE reservas
        SET fecha = ?, tipo = ?, unidades = ?, precio = ?
        WHERE id = ? AND usuario = ?
    `;

    const valores = [
        reserva.fecha,
        reserva.tipo,
        reserva.unidades,
        reserva.precio,
        id,
        usuario
    ];

    const [resultado] = await pool.execute(sql, valores);

    return resultado.affectedRows;
}

export async function eliminarReserva(id, usuario) {
    const sql = `
        DELETE FROM reservas
        WHERE id = ? AND usuario = ?
    `;

    const [resultado] = await pool.execute(sql, [id, usuario]);

    return resultado.affectedRows;
}
