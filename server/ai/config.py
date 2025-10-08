"""
Configurações do Sistema de IA para Milhas
"""

import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_MODEL = 'gpt-4-turbo-preview'

# Telegram Configuration
TELEGRAM_API_ID = int(os.getenv('TELEGRAM_API_ID', 0))
TELEGRAM_API_HASH = os.getenv('TELEGRAM_API_HASH')
TELEGRAM_PHONE = os.getenv('TELEGRAM_PHONE')

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/ss-milhas-ai')

# Redis Configuration
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')

# Telegram Channels to Monitor
TELEGRAM_CHANNELS = [
    'BANCO_DE_MILHAS_ON_FIRE',
    'BALCAO_DE_MILHAS_COMPRAS',
    'BALCAO_DE_MILHAS_COMP',
    'BALCAO_DE_MILHAS_ASM',
    'MILHAS_TRADING_BR',
    'SMILES_OPORTUNIDADES',
    'LATAM_PASS_NEGOCIOS'
]

# AI Analysis Settings
ANALYSIS_INTERVAL = 30  # segundos
OPPORTUNITY_THRESHOLD = 0.8  # threshold de confiança para oportunidades
MAX_PRICE_DEVIATION = 0.15  # 15% de desvio máximo de preço

# Notification Settings
ENABLE_NOTIFICATIONS = True
NOTIFICATION_CHANNELS = ['email', 'webhook', 'telegram']
