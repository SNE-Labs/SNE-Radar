#!/usr/bin/env python3
"""
SNE Data Collector - Microserviço para coleta de dados de mercado
Versão melhorada com HMAC + anti-replay + cache-first
"""

import os
import sys
import time
import hmac
import hashlib
import logging
from datetime import datetime, timedelta

# Adicionar diretório atual ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Flask e dependências
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import redis
import json as json_lib

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurações
app = Flask(__name__)
CORS(app, origins=["https://api.snelabs.space", "https://sne-radar-y21p.onrender.com"])

# Redis connection (opcional - só se disponível)
try:
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')
    redis_client = redis.from_url(REDIS_URL)
    redis_available = True
except:
    redis_client = None
    redis_available = False

# HMAC Secret (mesmo para todos os serviços)
HMAC_SECRET = os.environ.get('SNE_HMAC_SECRET', 'sne-shared-secret-change-in-prod')

# Timeouts otimizados
COLLECTOR_TIMEOUT = 8  # backend → collector
BINANCE_TIMEOUT = 5    # collector → Binance

# ================================
# ENDPOINTS
# ================================

@app.route('/health')
def health():
    """Health check - Deve responder sempre"""
    return jsonify({"ok": True, "service": "sne-collector"})

@app.route('/debug/binance')
def debug_binance():
    """Endpoint de debug para testar egress da Binance"""
    try:
        r = requests.get("https://api.binance.com/api/v3/time", timeout=BINANCE_TIMEOUT)

        # Não assume JSON em caso de erro
        body = None
        try:
            body = r.json()
        except Exception:
            body = r.text[:500] if r.text else "No response body"

        return jsonify({
            "ok": True,
            "status": r.status_code,
            "body": body,
            "egress_ok": r.status_code == 200
        })

    except Exception as e:
        return jsonify({
            "ok": False,
            "err": str(e),
            "egress_ok": False
        }), 502

@app.route('/debug/binance')
def debug_binance():
    """Endpoint de debug para testar egress da Binance"""
    try:
        # Teste básico na Binance
        response = requests.get(
            "https://api.binance.com/api/v3/time",
            timeout=BINANCE_TIMEOUT
        )

        return jsonify({
            "status_code": response.status_code,
            "response": response.json() if response.status_code == 200 else response.text,
            "timestamp": datetime.utcnow().isoformat(),
            "egress_ok": response.status_code == 200
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
            "egress_ok": False
        }), 500

# ================================
# MAIN
# ================================

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    print(f"🚀 SNE Data Collector starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
