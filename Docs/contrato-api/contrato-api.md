# Contrato definitivo da API

Base URL local: `http://localhost:3000`

## Autenticação

Nesta A3 não há autenticação implementada. O campo `usuario_id` é enviado no corpo do voto para permitir a demonstração com o usuário de teste. Na E3, o valor deve vir de um usuário autenticado por token, e não do corpo da requisição.

## Recurso principal Votos

| URI | Verbo | Request | Response e status | Regra |
| --- | --- | --- | --- | --- |
| `/api/votos` | GET | Opcional: `?enquete_id=1` | `200` com lista de votos | Leitura pública nesta etapa. |
| `/api/votos/:id` | GET | — | `200` com voto; `404` se não existir | Leitura pública nesta etapa. |
| `/api/votos` | POST | `{ "enquete_id": 1, "opcao_enquete_id": 1, "usuario_id": 1 }` | `201` com voto; `400`, `404`, `409` ou `422` em erro | Enquete deve estar ativa; opção deve pertencer à enquete; somente um voto por usuário na enquete. |
| `/api/votos/:id` | PUT | `{ "opcao_enquete_id": 2 }` | `200` com voto atualizado; `404` ou `422` em erro | Troca a opção do voto existente em enquete ativa. |
| `/api/votos/:id` | DELETE | — | `204` sem corpo; `404` se não existir | Exclui o voto informado. |

## Cadastro de morador

| URI | Verbo | Request | Response e status | Regra |
| --- | --- | --- | --- | --- |
| `/api/usuarios` | POST | `{ "nome": "Ana", "email": "ana@email.com", "senha": "123456" }` | `201` com os dados públicos do usuário; `400` ou `409` em erro | Nome, e-mail e senha são obrigatórios. O e-mail deve ser único. |

## Recursos de apoio Somente leitura

| URI | Verbo | Response |
| --- | --- | --- |
| `/api/regioes` | GET | `200` com regiões ativas. |
| `/api/horarios-coleta?regiao_id=1` | GET | `200` com horários; o filtro é opcional. |
| `/api/enquetes?status=ativa` | GET | `200` com enquetes; o filtro é opcional. |
| `/api/enquetes/:enqueteId/opcoes` | GET | `200` com opções da enquete. |

## Exemplo

### Criar voto

```json
{ "enquete_id": 1, "opcao_enquete_id": 1, "usuario_id": 1 }
```

### Resposta 201

```json
{ "id": 1, "enquete_id": 1, "opcao_enquete_id": 1, "usuario_id": 1, "data_criacao": "2026-11-12T12:00:00.000Z" }
```
