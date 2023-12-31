const {hash, compare} = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { application } = require("express");

class UserController {

    async create(request, response){
        const {name, email, password} = request.body

        const database = await sqliteConnection(); //conexao com o banco de dados.

        const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        if(checkUserExist){
            throw new AppError("Este email já está em uso.")
        }  

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
        );
        

        return response.status(201).json();

    }

    async update(request, response){
        const { name, email, password, old_password } = request.body
        const { id } = request.params;

        const database = await sqliteConnection()

        const user = await database.get("SELECT * FROM users WHERE id = (?)",[id])
        if(!user){
            throw new AppError("Usuário nao encontrado.")
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)",[email] )
        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
            throw new AppError("Este email já está em uso")
        }

        
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        
        if(password && !old_password){
            throw new AppError("é necessário inserir a senha antiga para definir a nova.")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword){
                throw new AppError("A senha antiga inserida está incorreta.")
            }

            user.password = await hash(password, 8);
        }

      


        
      

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            where id = ?`,
            [user.name, user.email, user.password, id]
        );

        return response.json()


    }
}



module.exports = UserController