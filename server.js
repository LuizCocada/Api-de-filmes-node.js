require("express-async-errors");// Biblioteca para captura de erros

const migrationsRun = require("./database/sqlite/migrations")  //conexao com o database

const AppError = require("./utils/AppError")

const express = require("express");

const app = express(); //inicializando o express

const routes = require("./routes");

migrationsRun(); //iniciando o database


app.use(express.json()) //necessario para leitura, transformando-o em json

app.use(routes); // app usando as rotas  criadas pelo routes e gerenciada pelo index da pasta ROUTES.


//Utilizando o express-async-errors. capturando erros, etc.
app.use((error, request, response, next) =>{
    if(error instanceof AppError){ //se o error vier do cliente
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.log(error);

    return response.status(500).json({
        status: "error",
        message: "internal server error",
    })
})

const PORT = 4444
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})