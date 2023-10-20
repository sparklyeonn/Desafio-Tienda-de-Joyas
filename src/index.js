const express = require('express')
const cors = require('cors')
const {getJoyas,getJoyasFiltros} = require('./consultas.js')
const app = express()
app.use(express.json())
app.use(cors())
const port = 3001;

function middleware(req,res,next){
    console.log(
        `Se genero una peticion `+req.method+
        ` desde `+req.hostname+
        ` con el url ` + req.originalUrl
    )
    next();
}

app.use(middleware)

app.get("/joyas", async (req, res) => {
    try {
        const limits = req.query.limits
        const page = req.query.page
        const order_by = req.query.order_by
        result = await getJoyas(limits,page,order_by)
        res.json(result)
        res.status(200)
    } catch (error) {
        console.log(error.code,error.message)
    }
})

app.get("/joyas/filtros", async (req,res) => {
    try {
        const min = req.query.precio_min
        const max = req.query.precio_max
        const category = req.query.categoria
        const metal = req.query.metal
        result = await getJoyasFiltros(min,max,category,metal)
        res.json(result)
        res.status(200)
    } catch (error) {
        console.log(error.code,error.message)
    }
})

app.listen(port, console.log('escuchando peticiones'))