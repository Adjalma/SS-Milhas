"""
Gerenciador de Banco de Dados para Sistema de IA
"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
import json
import logging

from config import MONGODB_URI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.client = AsyncIOMotorClient(MONGODB_URI)
        self.db = self.client['ss-milhas-ai']
        
        # Collections
        self.opportunities = self.db['opportunities']
        self.market_data = self.db['market_data']
        self.user_profiles = self.db['user_profiles']
        self.telegram_messages = self.db['telegram_messages']
        self.ai_analyses = self.db['ai_analyses']
        
    async def save_opportunity(self, opportunity_data: Dict) -> str:
        """Salva oportunidade identificada pela IA"""
        try:
            opportunity_data['created_at'] = datetime.now()
            opportunity_data['status'] = 'active'
            
            result = await self.opportunities.insert_one(opportunity_data)
            logger.info(f"Oportunidade salva: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Erro ao salvar oportunidade: {e}")
            return None
    
    async def get_opportunities(self, 
                              limit: int = 50, 
                              program: Optional[str] = None,
                              min_confidence: float = 0.7) -> List[Dict]:
        """Recupera oportunidades do banco"""
        try:
            query = {
                'confidence': {'$gte': min_confidence},
                'status': 'active'
            }
            
            if program:
                query['analysis.program'] = program.lower()
            
            cursor = self.opportunities.find(query).sort('created_at', DESCENDING).limit(limit)
            opportunities = await cursor.to_list(length=limit)
            
            # Converte ObjectId para string
            for opp in opportunities:
                opp['_id'] = str(opp['_id'])
                
            return opportunities
            
        except Exception as e:
            logger.error(f"Erro ao recuperar oportunidades: {e}")
            return []
    
    async def update_opportunity_status(self, opportunity_id: str, status: str) -> bool:
        """Atualiza status de uma oportunidade"""
        try:
            from bson import ObjectId
            result = await self.opportunities.update_one(
                {'_id': ObjectId(opportunity_id)},
                {'$set': {'status': status, 'updated_at': datetime.now()}}
            )
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Erro ao atualizar status: {e}")
            return False
    
    async def save_telegram_message(self, message_data: Dict) -> str:
        """Salva mensagem do Telegram para análise histórica"""
        try:
            message_data['processed_at'] = datetime.now()
            result = await self.telegram_messages.insert_one(message_data)
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Erro ao salvar mensagem: {e}")
            return None
    
    async def get_market_data(self, program: str, days: int = 30) -> List[Dict]:
        """Recupera dados de mercado históricos"""
        try:
            start_date = datetime.now() - timedelta(days=days)
            
            cursor = self.market_data.find({
                'program': program.lower(),
                'date': {'$gte': start_date}
            }).sort('date', ASCENDING)
            
            return await cursor.to_list(length=None)
            
        except Exception as e:
            logger.error(f"Erro ao recuperar dados de mercado: {e}")
            return []
    
    async def save_market_data(self, market_data: Dict) -> str:
        """Salva dados de mercado"""
        try:
            market_data['date'] = datetime.now()
            result = await self.market_data.insert_one(market_data)
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Erro ao salvar dados de mercado: {e}")
            return None
    
    async def save_ai_analysis(self, analysis_data: Dict) -> str:
        """Salva análise da IA"""
        try:
            analysis_data['created_at'] = datetime.now()
            result = await self.ai_analyses.insert_one(analysis_data)
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Erro ao salvar análise: {e}")
            return None
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict]:
        """Recupera perfil do usuário"""
        try:
            profile = await self.user_profiles.find_one({'user_id': user_id})
            if profile:
                profile['_id'] = str(profile['_id'])
            return profile
            
        except Exception as e:
            logger.error(f"Erro ao recuperar perfil: {e}")
            return None
    
    async def update_user_profile(self, user_id: str, profile_data: Dict) -> bool:
        """Atualiza perfil do usuário"""
        try:
            profile_data['updated_at'] = datetime.now()
            result = await self.user_profiles.update_one(
                {'user_id': user_id},
                {'$set': profile_data},
                upsert=True
            )
            return True
            
        except Exception as e:
            logger.error(f"Erro ao atualizar perfil: {e}")
            return False
    
    async def get_statistics(self) -> Dict:
        """Recupera estatísticas do sistema"""
        try:
            stats = {
                'total_opportunities': await self.opportunities.count_documents({}),
                'active_opportunities': await self.opportunities.count_documents({'status': 'active'}),
                'total_messages': await self.telegram_messages.count_documents({}),
                'total_analyses': await self.ai_analyses.count_documents({}),
                'programs_stats': {}
            }
            
            # Estatísticas por programa
            programs = ['smiles', 'latam', 'tudoazul', 'livelo', 'iberia', 'avios']
            for program in programs:
                count = await self.opportunities.count_documents({
                    'analysis.program': program,
                    'status': 'active'
                })
                stats['programs_stats'][program] = count
            
            return stats
            
        except Exception as e:
            logger.error(f"Erro ao recuperar estatísticas: {e}")
            return {}
    
    async def cleanup_old_data(self, days: int = 90):
        """Limpa dados antigos"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            
            # Remove oportunidades antigas inativas
            result1 = await self.opportunities.delete_many({
                'created_at': {'$lt': cutoff_date},
                'status': {'$in': ['expired', 'completed']}
            })
            
            # Remove mensagens antigas
            result2 = await self.telegram_messages.delete_many({
                'processed_at': {'$lt': cutoff_date}
            })
            
            logger.info(f"Limpeza concluída: {result1.deleted_count} oportunidades, {result2.deleted_count} mensagens")
            
        except Exception as e:
            logger.error(f"Erro na limpeza: {e}")
    
    async def close(self):
        """Fecha conexão com o banco"""
        self.client.close()

# Instância global do gerenciador
db_manager = DatabaseManager()
