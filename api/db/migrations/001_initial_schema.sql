-- Execute este arquivo dentro do banco coleta_ecologica no pgAdmin.
BEGIN;
CREATE TABLE IF NOT EXISTS usuarios (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, nome VARCHAR(150) NOT NULL CHECK (btrim(nome) <> ''),
 email VARCHAR(254) NOT NULL CHECK (btrim(email) <> ''), senha_hash VARCHAR(255) NOT NULL CHECK (btrim(senha_hash) <> ''),
 perfil VARCHAR(20) NOT NULL DEFAULT 'morador' CHECK (perfil IN ('morador','gestao')),
 data_criacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_unico_idx ON usuarios (lower(email));
CREATE TABLE IF NOT EXISTS regioes (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, nome VARCHAR(120) NOT NULL CHECK (btrim(nome) <> ''),
 cidade VARCHAR(120) NOT NULL CHECK (btrim(cidade) <> ''), estado CHAR(2) NOT NULL CHECK (estado ~ '^[A-Z]{2}$'),
 ativo BOOLEAN NOT NULL DEFAULT TRUE, CONSTRAINT regioes_nome_cidade_unico UNIQUE (nome,cidade));
CREATE TABLE IF NOT EXISTS horarios_coleta (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, regiao_id BIGINT NOT NULL REFERENCES regioes(id) ON DELETE RESTRICT,
 tipo_coleta VARCHAR(60) NOT NULL CHECK (btrim(tipo_coleta) <> ''), dia_semana VARCHAR(15) NOT NULL CHECK (dia_semana IN ('segunda','terca','quarta','quinta','sexta','sabado','domingo')),
 horario_inicio TIME NOT NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE, CONSTRAINT horarios_coleta_unico UNIQUE (regiao_id,tipo_coleta,dia_semana,horario_inicio));
CREATE INDEX IF NOT EXISTS horarios_coleta_regiao_ativo_idx ON horarios_coleta (regiao_id,ativo) WHERE ativo;
CREATE TABLE IF NOT EXISTS enquetes (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, regiao_id BIGINT NOT NULL REFERENCES regioes(id) ON DELETE RESTRICT,
 titulo VARCHAR(180) NOT NULL CHECK (btrim(titulo) <> ''), descricao VARCHAR(500), data_inicio TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_fim TIMESTAMPTZ, status VARCHAR(20) NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho','ativa','encerrada')),
 CONSTRAINT enquetes_datas_validas CHECK (data_fim IS NULL OR data_fim > data_inicio));
CREATE INDEX IF NOT EXISTS enquetes_regiao_status_idx ON enquetes (regiao_id,status);
CREATE TABLE IF NOT EXISTS opcoes_enquete (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, enquete_id BIGINT NOT NULL REFERENCES enquetes(id) ON DELETE CASCADE,
 descricao VARCHAR(200) NOT NULL CHECK (btrim(descricao) <> ''), horario_inicio TIME NOT NULL, horario_fim TIME NOT NULL,
 ordem_exibicao INTEGER NOT NULL DEFAULT 1 CHECK (ordem_exibicao > 0), CONSTRAINT opcoes_enquete_horario_valido CHECK (horario_fim > horario_inicio),
 CONSTRAINT opcoes_enquete_ordem_unica UNIQUE (enquete_id,ordem_exibicao));
CREATE INDEX IF NOT EXISTS opcoes_enquete_enquete_idx ON opcoes_enquete (enquete_id);
CREATE TABLE IF NOT EXISTS votos (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, enquete_id BIGINT NOT NULL REFERENCES enquetes(id) ON DELETE RESTRICT,
 opcao_enquete_id BIGINT NOT NULL REFERENCES opcoes_enquete(id) ON DELETE RESTRICT, usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 data_criacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT votos_um_por_usuario_em_cada_enquete UNIQUE (enquete_id,usuario_id));
CREATE INDEX IF NOT EXISTS votos_enquete_opcao_idx ON votos (enquete_id,opcao_enquete_id);
COMMIT;
