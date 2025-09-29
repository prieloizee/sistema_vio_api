const e = require("express");
const connect = require("../db/connect");

module.exports = class eventoController {
  //criação de um evento
  static async createEvento(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador } = req.body;
    const imagem = req.file?.buffer || null;
    const tipoImagem = req.file?.mimetype || null;

    //validação genérica de todos atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos!" });
    }

    const query = `INSERT into evento (nome, descricao, data_hora, local, fk_id_organizador, imagem, tipo_imagem) values (?, ?,?, ?, ?, ?, ?)`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador, imagem, tipoImagem];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o evento" });
        }
        return res.status(201).json({ message: "Evento criado com sucesso!" });
      });
    } catch (error) {
      console.log("erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  } //fim do create

  //Vistar todos os eventos cadastrados

  static async getAllEventos(req, res) {
    const query = `SELECT * FROM evento`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }

        return res
          .status(200)
          .json({ message: "Eventos listados com sucesso!", events: results });
      });
    } catch (error) {
      console.error("Erro ao executar a query:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  //update de um evento
  static async updateEvento(req, res) {
    const { id_evento, nome, descricao, data_hora, local, fk_id_organizador } =
      req.body;

    //validação genérica de todos atributos
    if (
      !id_evento ||
      !nome ||
      !descricao ||
      !data_hora ||
      !local ||
      !fk_id_organizador
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos!" });
    }

    const query = `UPDATE evento set nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? WHERE id_evento =? `;
    const values = [
      nome,
      descricao,
      data_hora,
      local,
      fk_id_organizador,
      id_evento,
    ];
    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados:", results);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o evento!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Evento atualizado com sucesso!" });
      });
    } catch (error) {
      console.log("erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  } //fim do update

  static async deleteEvento(req, res) {
    const idEvento = req.params.id;

    const query = `delete from evento where id_evento=?`;

    try {
      connect.query(query, idEvento, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir evento!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado!" });
        }
        return res
          .status(200)
          .json({ message: "Evento excluído com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta!", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async getEventosPorData(req, res) {
    const query = `SELECT * FROM evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        const dataEvento = new Date(results[0].data_hora);
        const dia = dataEvento.getDate();
        const mes = dataEvento.getMonth() + 1;
        const ano = dataEvento.getFullYear();
        console.log(dia + "/" + mes + "/" + ano);

        const dataEvento1 = new Date(results[1].data_hora);
        const dia1 = dataEvento1.getDate();
        const mes1 = dataEvento1.getMonth() + 1;
        const ano1 = dataEvento1.getFullYear();
        console.log(dia1 + "/" + mes1 + "/" + ano1);

        const dataEvento2 = new Date(results[2].data_hora);
        const dia2 = dataEvento2.getDate();
        const mes2 = dataEvento2.getMonth() + 1;
        const ano2 = dataEvento2.getFullYear();
        console.log(dia2 + "/" + mes2 + "/" + ano2);

        const now = new Date();
        const eventosPassados = results.filter(
          (evento) => new Date(evento.data_hora) < now
        );
        const eventosFuturos = results.filter(
          (evento) => new Date(evento.data_hora) >= now
        );

        const diferencaMs =
          eventosFuturos[0].data_hora.getTime() - now.getTime();
        const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24)); //transformar milisegundos em dias
        const horas = Math.floor(
          (diferencaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        console.log(diferencaMs, "Falta:" + dias + "dias," + horas + "horas");

        //comparando datas
        const dataFiltro = new Date("2024-11-20").toISOString().split("T");
        const eventosDia = results.filter(
          (evento) =>
            new Date(evento.data_hora).toISOString().split("T")[0] ===
            dataFiltro[0]
        );

        console.log("Eventos:", eventosDia);

        return res
          .status(200)
          .json({ message: "ok", eventosPassados, eventosFuturos });
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  }
  static async getEventosdia(req, res) {
    const dataRecebida = req.params.data;

    // Converte a data recebida em um objeto Date
    const dataInicial = new Date(dataRecebida);
    const dataFinal = new Date(dataInicial);
    dataFinal.setDate(dataInicial.getDate() + 7); // Adiciona 7 dias à data inicial

    const dataInicial2 = new Date("2024-01-01").toISOString().split("T")[0];
    const dataFinal2 = new Date("2024-01-07").toISOString().split("T")[0];

    const query = `
      SELECT * FROM evento WHERE data_hora >= ? AND data_hora <= ?`;
    try {
      connect.query(query, [dataInicial2, dataFinal2], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }

        return res
          .status(200)
          .json({ message: "OK", dataInicial2, dataFinal2 });
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  }


  static async getImagemEvento(req,res){
    const id = req.params.id;
    
    const query= "SELECT imagem FROM evento WHERE id_evento=?"
    connect.query(query,[id],(err,results)=>{
      if(err|| results.length === 0 || !results[0].imagem){
        return res.status(404).send("Imagem não foi encontrada");
      }
      res.set("Content-Type", results[0].tipo_imagem);
      res.send(results[0].imagem);
    })
  }

};