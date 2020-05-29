const express = require("express");
const nunjucks = require("nunjucks")

const server = express();

///habilitando corpo do formulario
server.use(express.urlencoded({extended: true}))

//configurando o banco de dados
const Pool = require('pg').Pool

const db = new Pool({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'doe'

})

//arquivos estaticos
server.use(express.static('public'))

//configurando lib de rendrização
nunjucks.configure("./",{
    express: server,
    noCache: true
})

server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados" + err)
        const donors = result.rows
        return res.render("index.html", {donors})
    })
})

server.post("/", function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos campos são obrigatórios")

    }

    //colocando valores dentro do bd
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query,values, function(err){
        if(err) return res.send("erro no banco de dados" + err)

        return res.redirect("/")
    })

})

 server.listen(3000, function(){
     console.log("Servidor iniciado");
 })