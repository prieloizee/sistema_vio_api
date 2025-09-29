//Importa a instância do Express configurada em index.js
const app = require("./index");
const cors = require('cors');

const corsOptions = {
    origin: '*',// Substitua pela orgigem permitida
    methods: 'GET,PUT,HEAD,PATCH,POST,DELETE',// metodos HTTP permitidos 
    credentiais: true,
    optionsSucessStatus: 204,
};

//Inicia o servidor na porta 5000, tornando a API acessível em http://localhost:5000
app.use(cors(corsOptions));
app.listen(5000);