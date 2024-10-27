const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ch0pp3r',
    database: 'Panaderia'
});

con.connect((err) => {
    if (err) throw err;
    console.log("Conectado a la base de datos.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post('/agregarProducto', (req, res) => {
    const { nombre, precio, descripcion, piezas, id_temporada } = req.body;

    con.query(
        'INSERT INTO Producto (nombre_producto, precio, descripcion, piezas, id_temporada) VALUES (?, ?, ?, ?, ?)',
        [nombre, precio, descripcion, piezas, id_temporada],
        (err, resultado) => {
            if (err) {
                console.error("Error al agregar el producto:", err);
                return res.status(500).send("Error al agregar el producto.");
            }
            res.send("Producto agregado correctamente.");
        }
    );
});

app.post('/actualizarProducto', (req, res) => {
    const { id, nombre, precio, descripcion, piezas, id_temporada } = req.body;

    con.query(
        'UPDATE Producto SET nombre_producto = ?, precio = ?, descripcion = ?, piezas = ?, id_temporada = ? WHERE id_producto = ?',
        [nombre, precio, descripcion, piezas, id_temporada, id],
        (err, resultado) => {
            if (err) {
                console.error("Error al actualizar el producto:", err);
                return res.status(500).send("Error al actualizar el producto.");
            }
            if (resultado.affectedRows === 0) {
                return res.status(404).send("Producto no encontrado.");
            }
            res.send("Producto actualizado correctamente.");
        }
    );
});

app.get('/obtenerProductos', (req, res) => {
    con.query('SELECT * FROM Producto', (err, productos) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).send("Error al obtener productos.");
        }

        let tablaHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Inventario de Productos</title>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.13/antd.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-4">
                    <h2 class="mb-4">Inventario de Productos</h2>
                    <table class="ant-table">
                        <thead class="ant-table-thead">
                            <tr>
                                <th class="ant-table-cell">ID</th>
                                <th class="ant-table-cell">Nombre</th>
                                <th class="ant-table-cell">Precio</th>
                                <th class="ant-table-cell">Descripción</th>
                                <th class="ant-table-cell">Piezas</th>
                                <th class="ant-table-cell">ID Temporada</th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">`;

        productos.forEach((producto) => {
            tablaHTML += `
                <tr class="ant-table-row">
                    <td class="ant-table-cell">${producto.id_producto}</td>
                    <td class="ant-table-cell">${producto.nombre_producto}</td>
                    <td class="ant-table-cell">${producto.precio}</td>
                    <td class="ant-table-cell">${producto.descripcion}</td>
                    <td class="ant-table-cell">${producto.piezas}</td>
                    <td class="ant-table-cell">${producto.id_temporada}</td>
                </tr>`;
        });

        tablaHTML += `
                        </tbody>
                    </table>
                </div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.13/antd.min.js"></script>
            </body>
            </html>`;

        res.send(tablaHTML);
    });
});



app.post('/borrarProducto', (req, res) => {
    const { id } = req.body;

    con.query('DELETE FROM Producto WHERE id_producto = ?', [id], (err, resultado) => {
        if (err) {
            console.error("Error al borrar el producto:", err);
            return res.status(500).send("Error al borrar el producto.");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Producto no encontrado.");
        }
        res.send("Producto eliminado correctamente.");
    });
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000.");
});
