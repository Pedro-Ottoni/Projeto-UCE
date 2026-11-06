const express = require("express")
const exphbs = require("express-handlebars")
const session = require("express-session")
const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const conexao = require("./db")

const app = express()
const port = process.env.PORT || 3000

const WHATSAPP = "5535988311771"

const CATEGORIAS = [
    { valor: 'toldos', nome: 'Toldos' },
    { valor: 'sombreadores', nome: 'Sombreadores' },
    { valor: 'luminosos', nome: 'Luminosos' },
    { valor: 'letras-caixa', nome: 'Letras Caixa' },
    { valor: 'fachadas', nome: 'Fachadas' }
]

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use(session({
    secret: "toldosecia_segredo",
    resave: false,
    saveUninitialized: false
}))

const armazenamento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, 'public', 'img'))
    },
    filename: function(req, file, cb){
        cb(null, 'produto-' + Date.now() + path.extname(file.originalname).toLowerCase())
    }
})

const upload = multer({
    storage: armazenamento,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb){
        const extensao = path.extname(file.originalname).toLowerCase()
        if(['.png', '.jpg', '.jpeg', '.webp'].includes(extensao)){
            cb(null, true)
        }else{
            cb(null, false)
        }
    }
})

app.use(function(req, res, next){
    res.locals.usuarioLogado = req.session.usuario
    res.locals.isAdmin = req.session.usuario && req.session.usuario.tipo == 'admin'
    res.locals.linkWhatsapp = "https://wa.me/" + WHATSAPP
    next()
})

const checkAuth = function(req, res, next){
    if(req.session.usuario){
        next()
    }else{
        res.redirect('/login')
    }
}

const checkAdmin = function(req, res, next){
    if(req.session.usuario && req.session.usuario.tipo == 'admin'){
        next()
    }else{
        res.status(403).render('404', { titulo: 'Acesso negado', css: 'Conta' })
    }
}

function criptografar(senha){
    return crypto.createHash('sha256').update(senha).digest('hex')
}


app.get('/', (req, res) => {
    res.render('home', { titulo: 'Home', css: 'Home', script: true })
})

app.get('/sobre', (req, res) => {
    res.render('sobre', { titulo: 'Sobre', css: 'Sobre' })
})

app.get('/trabalhos', (req, res) => {
    res.render('trabalhos', { titulo: 'Trabalhos', css: 'Trabalhos' })
})

app.get('/simular', (req, res) => {
    res.render('simular', { titulo: 'Simulação', css: 'Simular', script: true, semFaixa: true })
})

app.get('/faq', (req, res) => {
    res.render('faq', { titulo: 'FAQ', css: 'Faq' })
})


function paginaProdutos(categoria, view, titulo, res){
    const sql = "SELECT * FROM produtos WHERE categoria = ? ORDER BY id"

    conexao.query(sql, [categoria], function(erro, produtos){
        if(erro){
            console.log(erro)
            return res.status(500).send("Erro ao buscar os produtos")
        }
        res.render(view, { titulo: titulo, css: view.charAt(0).toUpperCase() + view.slice(1), produtos: produtos })
    })
}

app.get('/toldos', (req, res) => {
    paginaProdutos('toldos', 'toldos', 'Toldos', res)
})

app.get('/sombreadores', (req, res) => {
    paginaProdutos('sombreadores', 'sombreadores', 'Sombreadores', res)
})

app.get('/luminosos', (req, res) => {
    paginaProdutos('luminosos', 'luminosos', 'Luminosos', res)
})

app.get('/letras-caixa', (req, res) => {
    paginaProdutos('letras-caixa', 'letrasCaixa', 'Letras Caixa', res)
})

app.get('/fachadas', (req, res) => {
    paginaProdutos('fachadas', 'fachadas', 'Fachadas', res)
})


app.get('/contato', (req, res) => {
    res.render('contato', { titulo: 'Contato', css: 'Contatos', script: true })
})

app.post('/contato', (req, res) => {
    const nome = req.body.nome
    const email = req.body.email
    const cidade = req.body.cidade
    const telefone = req.body.telefone
    const mensagem = req.body.mensagem

    if(!nome || !email || !cidade || !telefone || !mensagem){
        return res.render('contato', { titulo: 'Contato', css: 'Contatos', erro: 'Preencha todos os campos!' })
    }

    const sql = "INSERT INTO cadastro_form (nome, email, cidade, telefone, mensagem) VALUES (?, ?, ?, ?, ?)"

    conexao.query(sql, [nome, email, cidade, telefone, mensagem], function(erro){
        if(erro){
            console.log(erro)
            return res.render('contato', { titulo: 'Contato', css: 'Contatos', erro: 'Erro ao enviar, tente novamente.' })
        }

        const texto = "Olá! Vim pelo site da Toldos e Companhia.\n" +
                      "Nome: " + nome + "\n" +
                      "Cidade: " + cidade + "\n" +
                      "Telefone: " + telefone + "\n" +
                      "Email: " + email + "\n" +
                      "Mensagem: " + mensagem

        res.redirect("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto))
    })
})


app.get('/login', (req, res) => {
    res.render('login', { titulo: 'Entrar', css: 'Conta' })
})

app.post('/login', (req, res) => {
    const email = req.body.email
    const senha = criptografar(req.body.senha || '')

    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?"

    conexao.query(sql, [email, senha], function(erro, resultado){
        if(erro){
            console.log(erro)
            return res.render('login', { titulo: 'Entrar', css: 'Conta', erro: 'Erro no servidor, tente novamente.' })
        }

        if(resultado.length == 0){
            return res.render('login', { titulo: 'Entrar', css: 'Conta', erro: 'Email ou senha incorretos!' })
        }

        req.session.usuario = {
            id: resultado[0].id,
            nome: resultado[0].nome,
            tipo: resultado[0].tipo
        }

        if(resultado[0].tipo == 'admin'){
            res.redirect('/admin/relatorios')
        }else{
            res.redirect('/')
        }
    })
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro', { titulo: 'Cadastro', css: 'Conta' })
})

app.post('/cadastro', (req, res) => {
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha

    if(!nome || !email || !senha || senha.length < 6){
        return res.render('cadastro', { titulo: 'Cadastro', css: 'Conta', erro: 'Preencha tudo e use uma senha de pelo menos 6 caracteres.' })
    }

    const sql = "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, 'cliente')"

    conexao.query(sql, [nome, email, criptografar(senha)], function(erro){
        if(erro){
            if(erro.code == 'ER_DUP_ENTRY'){
                return res.render('cadastro', { titulo: 'Cadastro', css: 'Conta', erro: 'Este email já está cadastrado!' })
            }
            console.log(erro)
            return res.render('cadastro', { titulo: 'Cadastro', css: 'Conta', erro: 'Erro ao cadastrar, tente novamente.' })
        }
        res.render('login', { titulo: 'Entrar', css: 'Conta', sucesso: 'Conta criada! Agora é só entrar.' })
    })
})

app.get('/logout', checkAuth, (req, res) => {
    req.session.destroy(function(){
        res.redirect('/')
    })
})


function paginaAdminProdutos(res, mensagens, filtro){
    const filtroValido = CATEGORIAS.some(function(c){ return c.valor == filtro })

    let sql = "SELECT * FROM produtos ORDER BY id"
    let valores = []
    if(filtroValido){
        sql = "SELECT * FROM produtos WHERE categoria = ? ORDER BY id"
        valores = [filtro]
    }
    const sqlContagem = "SELECT categoria, COUNT(*) AS quantidade FROM produtos GROUP BY categoria"

    conexao.query(sql, valores, function(erro, produtos){
        if(erro){
            console.log(erro)
            return res.status(500).send("Erro ao buscar os produtos")
        }

        conexao.query(sqlContagem, function(erro, contagem){
            if(erro){
                console.log(erro)
                return res.status(500).send("Erro ao buscar os produtos")
            }

            let total = 0
            const filtros = CATEGORIAS.map(function(c){
    const linha = contagem.find(function(l){
        return l.categoria.toLowerCase() == c.valor.toLowerCase()
    })

    const quantidade = linha ? linha.quantidade : 0

    total += quantidade

    return {
        valor: c.valor,
        nome: c.nome,
        quantidade: quantidade,
        ativo: c.valor == filtro
    }
})

const produtosFormatados = produtos.map(function(p){
    const categoriaEncontrada = CATEGORIAS.find(function(c){
        return c.valor.toLowerCase() == p.categoria.toLowerCase() ||
               c.nome.toLowerCase() == p.categoria.toLowerCase()
    })

    return {
        ...p,
        categoriaNome: categoriaEncontrada
            ? categoriaEncontrada.nome
            : p.categoria
    }


})
            res.render('admin/produtos', {
                titulo: 'Produtos',
                css: 'Conta',
                produtos: produtosFormatados,
                categorias: CATEGORIAS,
                filtros: filtros,
                filtro: filtroValido ? filtro : '',
                total: total,
                erro: mensagens.erro,
                sucesso: mensagens.sucesso
            })
        })
    })
}

app.get('/admin/produtos', checkAdmin, (req, res) => {
    paginaAdminProdutos(res, {}, req.query.categoria)
})

app.post('/admin/produtos', checkAdmin, upload.single('imagem'), (req, res) => {
    const nome = req.body.nome
    const categoria = req.body.categoria
    const categoriaValida = CATEGORIAS.some(function(c){ return c.valor == categoria })

    if(!nome || !categoriaValida){
        return paginaAdminProdutos(res, { erro: 'Preencha o nome e escolha uma categoria!' })
    }

    if(!req.file){
        return paginaAdminProdutos(res, { erro: 'Envie uma imagem PNG, JPG ou WEBP de até 5MB!' })
    }

    const sql = "INSERT INTO produtos (nome, categoria, imagem) VALUES (?, ?, ?)"

    conexao.query(sql, [nome, categoria, req.file.filename], function(erro){
        if(erro){
            console.log(erro)
            return paginaAdminProdutos(res, { erro: 'Erro ao cadastrar o produto.' })
        }
        paginaAdminProdutos(res, { sucesso: 'Produto "' + nome + '" cadastrado com sucesso!' }, categoria)
    })
})

app.post('/admin/produtos/excluir/:id', checkAdmin, (req, res) => {
    const filtro = req.query.categoria

    conexao.query("DELETE FROM produtos WHERE id = ?", [req.params.id], function(erro){
        if(erro){
            console.log(erro)
        }

        if(filtro){
            res.redirect('/admin/produtos?categoria=' + encodeURIComponent(filtro))
        }else{
            res.redirect('/admin/produtos')
        }
    })
})

app.get('/admin/usuarios', checkAdmin, (req, res) => {
    const sql = "SELECT id, nome, email, tipo, DATE_FORMAT(data_cadastro, '%d/%m/%Y') AS data_cadastro FROM usuarios ORDER BY id"

    conexao.query(sql, function(erro, usuarios){
        if(erro){
            console.log(erro)
            return res.status(500).send("Erro ao buscar os usuários")
        }

        usuarios.forEach(function(u){
            u.admin = u.tipo == 'admin'
            u.euMesmo = u.id == req.session.usuario.id
        })

        res.render('admin/usuarios', { titulo: 'Usuários', css: 'Conta', usuarios: usuarios })
    })
})

app.post('/admin/usuarios/tipo/:id', checkAdmin, (req, res) => {
    const id = req.params.id

    if(id == req.session.usuario.id){
        return res.redirect('/admin/usuarios')
    }

    const sql = "UPDATE usuarios SET tipo = IF(tipo = 'admin', 'cliente', 'admin') WHERE id = ?"

    conexao.query(sql, [id], function(erro){
        if(erro){
            console.log(erro)
        }
        res.redirect('/admin/usuarios')
    })
})

app.post('/admin/usuarios/excluir/:id', checkAdmin, (req, res) => {
    const id = req.params.id

    if(id == req.session.usuario.id){
        return res.redirect('/admin/usuarios')
    }

    conexao.query("DELETE FROM usuarios WHERE id = ?", [id], function(erro){
        if(erro){
            console.log(erro)
        }
        res.redirect('/admin/usuarios')
    })
})

app.get('/admin/relatorios', checkAdmin, (req, res) => {
    const sqlTotais = "SELECT " +
        "(SELECT COUNT(*) FROM cadastro_form) AS contatos, " +
        "(SELECT COUNT(*) FROM usuarios) AS usuarios, " +
        "(SELECT COUNT(*) FROM produtos) AS produtos"
    const sqlCidade = "SELECT cidade, COUNT(*) AS quantidade FROM cadastro_form GROUP BY cidade ORDER BY quantidade DESC"
    const sqlCategoria = "SELECT categoria, COUNT(*) AS quantidade FROM produtos GROUP BY categoria"
    const sqlContatos = "SELECT nome, email, cidade, telefone, mensagem, " +
        "DATE_FORMAT(data_envio, '%d/%m/%Y %H:%i') AS data_envio FROM cadastro_form ORDER BY id DESC"

    conexao.query(sqlTotais, function(erro, totais){
        if(erro){ console.log(erro); return res.status(500).send("Erro ao gerar relatório") }

        conexao.query(sqlCidade, function(erro, porCidade){
            if(erro){ console.log(erro); return res.status(500).send("Erro ao gerar relatório") }

            conexao.query(sqlCategoria, function(erro, porCategoria){
                if(erro){ console.log(erro); return res.status(500).send("Erro ao gerar relatório") }

                conexao.query(sqlContatos, function(erro, contatos){
                    if(erro){ console.log(erro); return res.status(500).send("Erro ao gerar relatório") }

                    res.render('admin/relatorios', {
                        titulo: 'Relatórios',
                        css: 'Conta',
                        totais: totais[0],
                        porCidade: porCidade,
                        porCategoria: porCategoria,
                        contatos: contatos
                    })
                })
            })
        })
    })
})


app.use(function(req, res, next){
    res.status(404).render('404', { titulo: 'Página não encontrada', css: 'Conta' })
})

app.listen(port, () => {
    console.log('Servidor rodando na porta: ', port)
})
