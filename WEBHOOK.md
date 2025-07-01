# Como Configurar e Testar Webhook do Pipedrive no Projeto

## Objetivo
Permitir que seu projeto receba notificações automáticas do Pipedrive sempre que um evento (ex: novo negócio, pessoa atualizada) acontecer, usando webhooks.

---

## 1. Endpoint do Webhook

O endpoint já está disponível em:

```
/api/pipedrive/webhook
```

- Ele aceita apenas requisições **POST**.
- Todos os eventos recebidos são registrados no log do servidor.
- Você pode customizar o processamento dos eventos conforme sua necessidade.

---

## 2. Como Configurar o Webhook no Pipedrive

1. **Acesse o painel do Pipedrive**
   - Vá em **Ferramentas > Webhooks** (ou Configurações > Ferramentas > Webhooks)

2. **Clique em “Adicionar webhook”**

3. **Preencha os campos:**
   - **URL do webhook:**
     - Em produção: `https://seusite.com/api/pipedrive/webhook`
     - Em desenvolvimento local: use [ngrok](https://ngrok.com/) ou similar para expor seu localhost
   - **Eventos a monitorar:**
     - Selecione os eventos que deseja receber (ex: negócio criado, pessoa atualizada, etc)
   - **Método:**
     - POST

4. **Salve o webhook**

---

## 3. Testando o Webhook

- Realize uma ação no Pipedrive (ex: crie um novo negócio ou atualize uma pessoa)
- O Pipedrive enviará um POST para o endpoint configurado
- No terminal do seu projeto, você verá o log:

```
Webhook recebido do Pipedrive: { ...dados do evento... }
```

---

## 4. Dicas de Segurança

- Valide a origem das requisições (Pipedrive envia um header especial `X-Pipedrive-Signature` se você configurar um token secreto)
- Implemente autenticação ou verificação de IP se necessário
- Nunca exponha dados sensíveis no log em produção

---

## 5. Exemplo de Payload Recebido

```json
{
  "event": "added.deal",
  "current": { "id": 123, "title": "Novo negócio", ... },
  "previous": null,
  "meta": { ... }
}
```

---

## 6. Personalizando o processamento

No arquivo `app/api/pipedrive/webhook/route.ts`, você pode:
- Salvar os dados recebidos no banco de dados
- Disparar notificações
- Integrar com outros sistemas
- Filtrar eventos por tipo

---

## 7. Dúvidas?
Se precisar de ajuda para testar ou customizar o webhook, abra uma issue ou entre em contato! 