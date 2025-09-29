DELIMITER //

CREATE TRIGGER atualizar_total_ingressos
AFTER INSERT ON ingresso_compra
FOR EACH ROW
BEGIN
  DECLARE v_id_evento INT;

  -- Pega o id_evento relacionado ao ingresso comprado
  SELECT fk_id_evento INTO v_id_evento
  FROM ingresso
  WHERE id_ingresso = NEW.fk_id_ingresso;

  -- Se o evento já está no resumo, só soma os ingressos
  IF EXISTS (
    SELECT 1 FROM resumo_evento WHERE id_evento = v_id_evento
  ) THEN
    UPDATE resumo_evento
    SET total_ingressos = total_ingressos + NEW.quantidade
    WHERE id_evento = v_id_evento;
  ELSE
    -- Se não existe ainda, insere novo
    INSERT INTO resumo_evento (id_evento, total_ingressos)
    VALUES (v_id_evento, NEW.quantidade);
  END IF;
END; //

DELIMITER ;
