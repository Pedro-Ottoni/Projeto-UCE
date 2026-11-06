const mysql = require('mysql2')

const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toldos'
})

conexao.getConnection(function(erro, conn){
    if(erro){
        console.log("Erro ao conectar no banco de dados!", erro.message)
    }else{
        console.log("Banco de dados conectado!")
        conn.release()
    }
})

module.exports = conexao
