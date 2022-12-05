const express = require('express');
const app = express();
const mysql = require('mysql2');
//Motor de plantilla
const hbs = require('hbs');
//Encontrar archivo
const path = require('path');
//Para enviar mails a los clientes
const nodemailer = require('nodemailer');
//Variables de entorno
require('dotenv').config();

//Configuramos el puerto
const PORT = process.env.PORT || 9000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))

//Configuramos el motor de plantillas de HBS
app.set('view engine', 'hbs');
//Configuramos la configuracion de las plantillas
app.set('views', path.join(__dirname, 'views'));
//Configuramos los parciales de los motores de las plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'));

//Conexion a la base de datos
/* const conexion =mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT
}); */

/* conexion.connect((err) => {
    if(err) throw err;
    console.log(`Conectado a la Database ${process.env.database}`);
}); */

//Rutas de la aplicacion
app.get('/', (req, res) => {
res.render('index', {
    titulo: 'Titulo'
    })
});

app.get('/formulario', (req, res) => {
    res.render('formulario')
});

app.get('/productos', (req, res) => {

    let sql = "SELECT * FROM productos";
    conexion.query(sql, function(err, result){
        if (err) throw err;
            //console.log(result);
            res.render('productos', {
                titulo: 'Productos',
                datos: result
            })
    })
})

app.get('/contacto', (req, res) => {
    res.render('contacto', {
        titulo: 'Contacto'
    })
})

app.post('/formulario', (req, res) => {
    console.log(req);

    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;

    let datos = {
        nombre: nombre,
        precio: precio,
        descripcion: descripcion
    }

    let sql = "INSERT INTO productos set ?";

        conexion.query(sql, datos, function(err){
            if (err) throw err;
                console.log(`1 registro insertado`);
                res.render('enviado') //Es la página a donde se va a enviar al cliente después de que envíe los datos//
        })
})

app.post('/contacto', (req, res) => {
    const nombre = req.body.nombre;
    const email = req.body.email;

    //Creamos una funcion para enviar emails al cliente
    async function envioMail(){
        //Coonfiguramos la cuenta del envío
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            },
        });

        //Envío del mail
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: `${email}`,
            subject: "¡Gracias por suscribirte!",
            html: 'Muchas gracias por visitar nuestra página. <br> Recibirás nuestras promociones en esta dirección de correo.'
        })
    }

    let datos = {
        nombre: nombre,
        email: email,
    }

    let sql = "INSERT INTO contacto set ?";

        conexion.query(sql, datos, function(err){
            if (err) throw err;
                console.log(`1 registro insertado`);
                //En esta instancia le mandamos el email al cliente
                envioMail().catch(console.error);
                res.render('enviado')
        })
})

//Servidor a la escucha de las peticiones
app.listen(PORT, ()=>{
console.log(`Servidor trabajando en el puerto: ${PORT}`);
});

