const connect = require("../db/connect");

module.exports = class eventoController {
  //criação de um evento
  static async createIngresso(req, res) {
    const { preco, tipo, fk_id_evento } = req.body;
     //validação genérica de todos atributos
     if (!preco || !tipo || !fk_id_evento ) {
        return res
          .status(400)
          .json({ error: "Todos os campos devem ser preenchidos!" });
      }

      const query = `INSERT into ingresso (preco, tipo, fk_id_evento) values (?, ?, ?)`;
    const values = [preco, tipo, fk_id_evento];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o ingresso" });
        }
        return res.status(201).json({ message: "ingresso criado com sucesso!" });
        
      });
    } catch (error) {
      console.log("erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }
  static async getByIdEvento(req, res) {
    const eventoId = req.params.id;
  
    const query = `
      SELECT 
        ingresso.id_ingresso, 
        ingresso.preco, 
        ingresso.tipo, 
        ingresso.fk_id_evento, 
        evento.nome AS nome_evento
      FROM ingresso
      JOIN evento ON ingresso.fk_id_evento = evento.id_evento
      WHERE evento.id_evento = ?;
    `;
  
    try {
      connect.query(query, [eventoId], (err, results) => {
        if (err) {
          console.error("Erro ao buscar ingressos por evento:", err);
          return res.status(500).json({ error: "Erro ao buscar ingressos do evento" });
        }
  
        res.status(200).json({
          message: "Ingressos do evento obtidos com sucesso",
          ingressos: results,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  //Visualizar todos os ingressos
  static async getAllIngressos(req, res){
    const query = `select * from ingresso`;
    
    try{
        connect.query(query, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({error:"Erro ao buscar ingresso"});
            }
            return res.status(200).json({message:"Ingressos listados com sucesso!", ingresso:results});
        })
    }catch(error){
        console.log("Erro ao executar a query: ", error);
        return res.status(500).json({error:"Erro interno do servidor!"})
    }
}//fim do get

//Update de um ingresso
static async updateIngresso(req, res) {
    // Desestrutura e recupera os dados enviados via corpo da requisição
    const { id_ingresso, preco, tipo, fk_id_evento } =
      req.body;

    // Validar se todos os campos foram preenchidos
    if (!id_ingresso || !preco || !tipo || !fk_id_evento ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `update ingresso set preco=?, tipo=?, fk_id_evento=? where id_ingresso=?`;
    const values = [preco, tipo, fk_id_evento, id_ingresso];

    try {
      connect.query(query, values, (err,results) => {
        console.log("Resultados: ", results);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o Ingresso!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Ingresso não encontrado" });
        }
        return res.status(201).json({ message: "Ingresso atualizado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      res.status(500).json({ error: "Erro interno so servidor!" });
    }
  }
  static async deleteIngresso(req, res){
    const idIngresso = req.params.id;

    const query = `delete from ingresso where id_ingresso=?`;

    try{
        connect.query(query, idIngresso, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({error: "Erro ao excluir ingresso!"});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({error:"Ingresso não encontrado!"});
            }
            return res.status(200).json({message:"Ingresso excluído com sucesso!"});
        });
    }catch(error){
        console.log("Erro ao executar a consulta!", error);
        res.status(500).json({error:"Erro interno do servidor"});
    }
}
}