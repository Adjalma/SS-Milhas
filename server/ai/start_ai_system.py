#!/usr/bin/env python3
"""
Script de Inicialização do Sistema de IA para Milhas
"""

import asyncio
import sys
import os
from pathlib import Path

# Adiciona o diretório atual ao path
sys.path.append(str(Path(__file__).parent))

from api import app
from telegram_monitor import TelegramMonitor
from database import DatabaseManager
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def initialize_system():
    """Inicializa o sistema de IA"""
    logger.info("🚀 Iniciando Sistema de IA para Milhas...")
    
    try:
        # Testa conexão com banco
        db = DatabaseManager()
        stats = await db.get_statistics()
        logger.info(f"✅ Banco de dados conectado: {stats}")
        
        # Inicia monitor do Telegram em background
        monitor = TelegramMonitor()
        
        # Inicia API
        logger.info("🌐 Iniciando API FastAPI...")
        config = uvicorn.Config(
            app,
            host="0.0.0.0",
            port=8000,
            log_level="info"
        )
        server = uvicorn.Server(config)
        
        # Executa servidor
        await server.serve()
        
    except Exception as e:
        logger.error(f"❌ Erro na inicialização: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("""
    🤖 SS MILHAS - Sistema de IA
    ============================
    
    Funcionalidades:
    - Monitoramento de canais Telegram
    - Análise inteligente de oportunidades
    - API REST para integração
    - Dashboard em tempo real
    
    Iniciando sistema...
    """)
    
    asyncio.run(initialize_system())
