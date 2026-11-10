BEGIN;
INSERT INTO regioes (nome,cidade,estado) VALUES ('Rafael Alto','Ibirama','SC') ON CONFLICT (nome,cidade) DO NOTHING;
INSERT INTO usuarios (nome,email,senha_hash,perfil) VALUES ('Marcelo','marcelo@example.com','$2b$10$hash_de_demonstracao','morador') ON CONFLICT DO NOTHING;
INSERT INTO enquetes (regiao_id,titulo,descricao,status)
SELECT id,'Melhor horário para a coleta seletiva','Consulta de demonstração para Rafael Alto.','ativa' FROM regioes WHERE nome='Rafael Alto' AND cidade='Ibirama' AND NOT EXISTS (SELECT 1 FROM enquetes WHERE titulo='Melhor horário para a coleta seletiva');
INSERT INTO opcoes_enquete (enquete_id,descricao,horario_inicio,horario_fim,ordem_exibicao)
SELECT e.id,d.descricao,d.inicio,d.fim,d.ordem FROM enquetes e CROSS JOIN (VALUES ('Manhã',TIME '08:00',TIME '10:00',1),('Fim da manhã',TIME '10:00',TIME '12:00',2),('Tarde',TIME '14:00',TIME '16:00',3)) AS d(descricao,inicio,fim,ordem) WHERE e.titulo='Melhor horário para a coleta seletiva' ON CONFLICT (enquete_id,ordem_exibicao) DO NOTHING;
COMMIT;
