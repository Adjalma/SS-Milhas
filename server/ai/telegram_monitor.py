"""
Monitor de Canais Telegram para Oportunidades de Milhas
"""

import asyncio
import re
import json
from datetime import datetime
from typing import List, Dict, Optional
from telethon import TelegramClient, events
from telethon.tl.types import Message
import logging

from config import TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_PHONE, TELEGRAM_CHANNELS
from ai_analyzer import AIAnalyzer
from database import DatabaseManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TelegramMonitor:
    def __init__(self):
        self.client = TelegramClient('session_name', TELEGRAM_API_ID, TELEGRAM_API_HASH)
        self.ai_analyzer = AIAnalyzer()
        self.db = DatabaseManager()
        self.channels_data = {}
        
    async def start(self):
        """Inicia o monitoramento dos canais"""
        await self.client.start(phone=TELEGRAM_PHONE)
        logger.info("Cliente Telegram conectado!")
        
        # Configura handlers para cada canal
        for channel in TELEGRAM_CHANNELS:
            await self.setup_channel_monitor(channel)
            
        # Inicia o loop de monitoramento
        await self.client.run_until_disconnected()
    
    async def setup_channel_monitor(self, channel_name: str):
        """Configura monitoramento para um canal específico"""
        try:
            entity = await self.client.get_entity(channel_name)
            
            @self.client.on(events.NewMessage(chats=entity))
            async def handler(event):
                await self.process_message(event.message, channel_name)
                
            logger.info(f"Monitor configurado para: {channel_name}")
            
        except Exception as e:
            logger.error(f"Erro ao configurar monitor para {channel_name}: {e}")
    
    async def process_message(self, message: Message, channel: str):
        """Processa mensagens recebidas dos canais"""
        try:
            # Extrai dados da mensagem
            message_data = await self.extract_message_data(message, channel)
            
            if message_data:
                # Analisa com IA
                analysis = await self.ai_analyzer.analyze_opportunity(message_data)
                
                if analysis and analysis.get('is_opportunity', False):
                    # Salva oportunidade no banco
                    await self.db.save_opportunity(analysis)
                    
                    # Envia notificação
                    await self.send_notification(analysis)
                    
                    logger.info(f"Oportunidade encontrada em {channel}: {analysis['summary']}")
                    
        except Exception as e:
            logger.error(f"Erro ao processar mensagem: {e}")
    
    async def extract_message_data(self, message: Message, channel: str) -> Optional[Dict]:
        """Extrai dados estruturados da mensagem"""
        text = message.text or ""
        date = message.date
        
        # Padrões para extrair informações
        patterns = {
            'compra': r'(?:compro|buy|compra)\s+(\w+)\s+(\d+(?:\.\d+)?[k]?)\s+(\d+)\s+cpf\s+([r$]?\d+(?:\.\d+)?)',
            'venda': r'(?:vendo|sell|venda)\s+(\w+)\s+(\d+(?:\.\d+)?[k]?)\s+(\d+)\s+cpf\s+([r$]?\d+(?:\.\d+)?)',
            'preco_por_mil': r'([r$]?\d+(?:\.\d+)?)\s*/\s*(?:mil|k)',
            'quantidade': r'(\d+(?:\.\d+)?[k]?)\s*(?:milhas|miles)',
            'programa': r'(smiles|latam|tudoazul|livelo|iberia|avios)',
            'cpf': r'(\d+)\s+cpf',
            'preco_total': r'total[:\s]*([r$]?\d+(?:\.\d+)?)'
        }
        
        extracted_data = {
            'channel': channel,
            'message_id': message.id,
            'text': text,
            'date': date.isoformat(),
            'author': getattr(message.sender, 'username', 'unknown'),
            'raw_data': {}
        }
        
        # Extrai dados usando regex
        for key, pattern in patterns.items():
            match = re.search(pattern, text.lower())
            if match:
                extracted_data['raw_data'][key] = match.groups() if len(match.groups()) > 1 else match.group(1)
        
        # Só retorna se tiver dados relevantes
        if extracted_data['raw_data']:
            return extracted_data
            
        return None
    
    async def send_notification(self, analysis: Dict):
        """Envia notificação sobre oportunidade encontrada"""
        notification = {
            'type': 'opportunity_alert',
            'data': analysis,
            'timestamp': datetime.now().isoformat(),
            'priority': analysis.get('confidence', 0.5)
        }
        
        # Aqui você pode implementar diferentes canais de notificação
        # Email, Webhook, Telegram, etc.
        logger.info(f"Notificação enviada: {analysis['summary']}")

class MessagePatterns:
    """Padrões para identificar diferentes tipos de mensagens"""
    
    COMPRA_PATTERNS = [
        r'compro\s+\w+\s+\d+[k]?\s+\d+\s+cpf',
        r'buy\s+\w+\s+\d+[k]?\s+\d+\s+cpf',
        r'interessado\s+em\s+comprar'
    ]
    
    VENDA_PATTERNS = [
        r'vendo\s+\w+\s+\d+[k]?\s+\d+\s+cpf',
        r'sell\s+\w+\s+\d+[k]?\s+\d+\s+cpf',
        r'oferta\s+de\s+venda'
    ]
    
    PROGRAMS = ['smiles', 'latam', 'tudoazul', 'livelo', 'iberia', 'avios']
    
    @classmethod
    def is_buy_message(cls, text: str) -> bool:
        """Verifica se é mensagem de compra"""
        text_lower = text.lower()
        return any(re.search(pattern, text_lower) for pattern in cls.COMPRA_PATTERNS)
    
    @classmethod
    def is_sell_message(cls, text: str) -> bool:
        """Verifica se é mensagem de venda"""
        text_lower = text.lower()
        return any(re.search(pattern, text_lower) for pattern in cls.VENDA_PATTERNS)
    
    @classmethod
    def extract_program(cls, text: str) -> Optional[str]:
        """Extrai programa de milhas mencionado"""
        text_lower = text.lower()
        for program in cls.PROGRAMS:
            if program in text_lower:
                return program
        return None

# Função principal para executar o monitor
async def main():
    monitor = TelegramMonitor()
    await monitor.start()

if __name__ == "__main__":
    asyncio.run(main())
