"""
Client para comunicação com o SNE Collector
Substitui chamadas diretas para Binance por chamadas seguras ao coletor
"""

import os
import requests
import logging

logger = logging.getLogger(__name__)

COLLECTOR_URL = os.getenv("COLLECTOR_URL")

def get_klines(symbol: str, interval: str, limit: int = 100):
    """
    Busca dados de klines via coletor (cache-first)
    Substitui chamadas diretas para api.binance.com
    """
    if not COLLECTOR_URL:
        raise RuntimeError("COLLECTOR_URL não configurado no backend")

    try:
        logger.info(f"Coletando dados via COLLECTOR_URL: {symbol} {interval} limit={limit}")

        r = requests.get(
            f"{COLLECTOR_URL}/binance/klines",
            params={
                "symbol": symbol.upper(),
                "interval": interval,
                "limit": limit
            },
            timeout=15,
        )
        r.raise_for_status()

        result = r.json()

        # Verificar se há erro na resposta
        if "error" in result:
            raise RuntimeError(f"Collector error: {result['error']}")

        # Retornar os dados (formato Binance)
        return result["data"] if "data" in result else result

    except requests.exceptions.RequestException as e:
        logger.error(f"Erro na comunicação com coletor: {str(e)}")
        raise RuntimeError(f"Falha ao coletar dados: {str(e)}")

def get_binance_data(endpoint: str, params: dict = None):
    """
    Função genérica para outros endpoints do Binance via coletor
    """
    if not COLLECTOR_URL:
        raise RuntimeError("COLLECTOR_URL não configurado no backend")

    try:
        r = requests.get(
            f"{COLLECTOR_URL}/binance/{endpoint}",
            params=params or {},
            timeout=10,
        )
        r.raise_for_status()

        result = r.json()

        if "error" in result:
            raise RuntimeError(f"Collector error: {result['error']}")

        return result["data"] if "data" in result else result

    except requests.exceptions.RequestException as e:
        logger.error(f"Erro na comunicação com coletor: {str(e)}")
        raise RuntimeError(f"Falha ao coletar dados: {str(e)}")
