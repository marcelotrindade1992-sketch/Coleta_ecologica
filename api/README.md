# API Coleta Ecológica

API Express para registrar e consultar votos da enquete de horários de coleta.

## Configuração


No arquivo `.env`, informe a senha do PostgreSQL

## Criar o banco pelo pgAdmin

1. Abra o pgAdmin, conecte-se ao servidor, clique com o botão direito em **Databases** e escolha **Create > Database**.
2. Informe `coleta_ecologica` e salve.
3. Selecione esse banco e abra **Tools > Query Tool**.
4. Copie e execute `db/migrations/001_initial_schema.sql` com **F5**.
5. Para dados de teste, execute `db/seed.sql`.

O modelo cria `usuarios`, `regioes`, `horarios_coleta`, `enquetes`, `opcoes_enquete` e `votos`. A restrição `UNIQUE (enquete_id, usuario_id)` impede voto duplicado na mesma enquete.

## Executar

```bash
npm run dev
```

A API ficará em `http://localhost:3000`.

## Rotas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/health` | Confere se a API está no ar. |
| GET | `/api/votos` | Lista votos; aceita `?enquete_id=1`. |
| POST | `/api/votos` | Registra um voto em enquete ativa. |

Abra `requests.http` com a extensão REST Client do VS Code para executar GET e POST.
