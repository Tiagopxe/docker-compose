FROM n8nio/n8n:latest

# Render define a porta automaticamente na variável $PORT
ENV N8N_PORT=$PORT
ENV N8N_PROTOCOL=https
EXPOSE 5678

CMD ["n8n"]
