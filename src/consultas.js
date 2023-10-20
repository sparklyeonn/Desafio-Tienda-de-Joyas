const { Pool } = require('pg')
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'joyas',
    allowExitOnIdle: true
})

const getJoyas = async (limits, page, order_by) => {
    const [campo, direccion] = order_by.split("_")
    const offset = (page - 1) * limits
    const consulta = `SELECT * FROM inventario ORDER BY ${campo} ${direccion} LIMIT $1 OFFSET $2`
    const values = [limits, offset]
    const { rows } = await pool.query(consulta, values)
    const data = { rows }.rows
    const totalJoyas = rows.length
    let stockTotal = 0
    var results = data.map(producto => ({
          "nombre": producto.nombre,
          "href": `/joyas/joya/${producto.id}`
        }));
    for (producto of data) {
        stockTotal += producto.stock;
      }
    const HATEOAS = {
        totalJoyas,
        stockTotal,
        results
    }
    return (HATEOAS)
}

const getJoyasFiltros = async (min,max,category,metal) => {
    const consulta = `
    SELECT * FROM inventario
    WHERE precio >= $1 AND precio <= $2
      AND categoria = $3 AND metal = $4;`
   const values = [min,max,category,metal]
   const {rows} = await pool.query(consulta, values)
   return rows
}


module.exports = {
    getJoyas,
    getJoyasFiltros
}