
exports.up = knex => knex.schema.createTable("movie_notes", table => {
    table.increments("id")
    table.text("title")
    table.text("description")
    table.integer("rating") 
    table.integer("user_id").references("id").inTable("users") //referencia com o id da tabela usuario

    table.timestamp("created_at").default(knex.fn.now())// funçao para definir a hora que foi criado
    table.timestamp("updated_at").default(knex.fn.now())// funçao para definir a hora que foi atualizado

});


exports.down = knex => knex.schema.dropTable("movie_notes")// down = deletar tabela.


/* PARA RODARMOS A MIGRATION PARA O BANCO DE DADOS, É PRECISO IR AO TERMINAL E EXECUTAR O COMANDO 

---  npx knex migrate:latest ---

PARA CRIAR UMA MIGRATE NO TERMINAL DIGITE 

--- npx knex migrate:make CreateNotes

*/
