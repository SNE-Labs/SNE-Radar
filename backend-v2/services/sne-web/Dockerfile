# Dockerfile para SNE Web Service
FROM python:3.11-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório da aplicação
WORKDIR /app

# Copiar requirements e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar diretório para logs
RUN mkdir -p /app/logs

# Expor porta (usar PORT do Railway ou 8080 como fallback)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "from app.main import app; print('Health check passed')"

# Comando para executar (usar PORT do Railway ou 8080 como fallback)
CMD sh -c "gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 2 --worker-class gevent --log-level debug --access-logfile - --error-logfile - app.main:app"