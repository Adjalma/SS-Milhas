"""
Analisador de IA para Oportunidades de Milhas
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional
from openai import AsyncOpenAI
import logging

from config import OPENAI_API_KEY, OPENAI_MODEL, OPPORTUNITY_THRESHOLD

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIAnalyzer:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        self.market_data = self._load_market_data()
        
    def _load_market_data(self) -> Dict:
        """Carrega dados de mercado para análise"""
        return {
            'smiles': {'avg_price': 16.5, 'price_range': (14.0, 19.0)},
            'latam': {'avg_price': 24.0, 'price_range': (20.0, 28.0)},
            'tudoazul': {'avg_price': 22.0, 'price_range': (18.0, 26.0)},
            'livelo': {'avg_price': 0.8, 'price_range': (0.6, 1.0)},
            'iberia': {'avg_price': 52.0, 'price_range': (48.0, 56.0)},
            'avios': {'avg_price': 52.0, 'price_range': (48.0, 56.0)}
        }
    
    async def analyze_opportunity(self, message_data: Dict) -> Optional[Dict]:
        """Analisa se a mensagem representa uma oportunidade de negócio"""
        try:
            # Prepara contexto para IA
            context = self._prepare_analysis_context(message_data)
            
            # Chama OpenAI para análise
            analysis = await self._call_openai_analysis(context)
            
            if analysis and analysis.get('is_opportunity', False):
                return self._format_analysis_result(analysis, message_data)
                
            return None
            
        except Exception as e:
            logger.error(f"Erro na análise de IA: {e}")
            return None
    
    def _prepare_analysis_context(self, message_data: Dict) -> str:
        """Prepara contexto para análise da IA"""
        raw_data = message_data.get('raw_data', {})
        text = message_data.get('text', '')
        
        context = f"""
        ANÁLISE DE OPORTUNIDADE DE MILHAS AÉREAS
        
        MENSAGEM ORIGINAL:
        {text}
        
        DADOS EXTRAÍDOS:
        - Canal: {message_data.get('channel', 'unknown')}
        - Autor: {message_data.get('author', 'unknown')}
        - Data: {message_data.get('date', 'unknown')}
        - Dados brutos: {json.dumps(raw_data, indent=2)}
        
        DADOS DE MERCADO ATUAIS:
        {json.dumps(self.market_data, indent=2)}
        
        INSTRUÇÕES:
        Analise se esta mensagem representa uma OPORTUNIDADE DE NEGÓCIO real.
        
        CRITÉRIOS PARA OPORTUNIDADE:
        1. Preço abaixo da média de mercado (pelo menos 10% de desconto)
        2. Quantidade significativa de milhas (acima de 20k)
        3. Programa de milhas reconhecido
        4. Informações claras sobre CPF e condições
        
        RESPONDA EM JSON COM:
        {{
            "is_opportunity": boolean,
            "confidence": float (0.0 a 1.0),
            "opportunity_type": "compra" ou "venda",
            "program": "nome do programa",
            "quantity": número de milhas,
            "price_per_mile": preço por milha,
            "total_price": preço total,
            "cpf_count": número de CPFs,
            "market_comparison": {{
                "avg_market_price": preço médio do mercado,
                "price_difference": diferença percentual,
                "is_below_market": boolean
            }},
            "risk_assessment": "baixo", "médio" ou "alto",
            "recommendation": "comprar", "vender" ou "aguardar",
            "summary": "resumo da oportunidade",
            "reasoning": "explicação da análise"
        }}
        """
        
        return context
    
    async def _call_openai_analysis(self, context: str) -> Optional[Dict]:
        """Chama OpenAI para análise"""
        try:
            response = await self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": """Você é um especialista em milhas aéreas com 15 anos de experiência no mercado brasileiro.
                        
                        Sua função é analisar mensagens de grupos de Telegram para identificar oportunidades reais de negócios em milhas aéreas.
                        
                        IMPORTANTE:
                        - Seja rigoroso: só classifique como oportunidade se realmente for vantajosa
                        - Considere riscos e condições do mercado
                        - Priorize transparência e segurança
                        - Responda SEMPRE em JSON válido
                        """
                    },
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            
            # Tenta extrair JSON da resposta
            try:
                # Remove markdown se presente
                if '```json' in content:
                    content = content.split('```json')[1].split('```')[0]
                elif '```' in content:
                    content = content.split('```')[1].split('```')[0]
                
                analysis = json.loads(content.strip())
                return analysis
                
            except json.JSONDecodeError:
                logger.error(f"Erro ao decodificar JSON da IA: {content}")
                return None
                
        except Exception as e:
            logger.error(f"Erro na chamada para OpenAI: {e}")
            return None
    
    def _format_analysis_result(self, analysis: Dict, message_data: Dict) -> Dict:
        """Formata resultado da análise"""
        return {
            'id': f"opp_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{message_data.get('message_id', 'unknown')}",
            'timestamp': datetime.now().isoformat(),
            'source': {
                'channel': message_data.get('channel'),
                'message_id': message_data.get('message_id'),
                'author': message_data.get('author'),
                'original_text': message_data.get('text')
            },
            'analysis': analysis,
            'confidence': analysis.get('confidence', 0.0),
            'is_opportunity': analysis.get('is_opportunity', False),
            'summary': analysis.get('summary', ''),
            'recommendation': analysis.get('recommendation', 'aguardar'),
            'risk_level': analysis.get('risk_assessment', 'médio')
        }
    
    async def analyze_market_trends(self, historical_data: List[Dict]) -> Dict:
        """Analisa tendências do mercado"""
        try:
            context = f"""
            ANÁLISE DE TENDÊNCIAS DO MERCADO DE MILHAS
            
            DADOS HISTÓRICOS:
            {json.dumps(historical_data[-100:], indent=2)}
            
            DADOS DE MERCADO ATUAIS:
            {json.dumps(self.market_data, indent=2)}
            
            INSTRUÇÕES:
            Analise as tendências de preços e identifique padrões.
            
            RESPONDA EM JSON COM:
            {{
                "market_trend": "alta", "baixa" ou "estável",
                "recommended_actions": ["comprar", "vender", "aguardar"],
                "price_predictions": {{
                    "smiles": {{"trend": "string", "confidence": float}},
                    "latam": {{"trend": "string", "confidence": float}},
                    "tudoazul": {{"trend": "string", "confidence": float}}
                }},
                "market_insights": ["insight1", "insight2", "insight3"],
                "risk_factors": ["fator1", "fator2"],
                "opportunity_windows": ["janela1", "janela2"]
            }}
            """
            
            response = await self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um analista de mercado especializado em milhas aéreas."
                    },
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                temperature=0.2,
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            
            # Extrai JSON
            if '```json' in content:
                content = content.split('```json')[1].split('```')[0]
            elif '```' in content:
                content = content.split('```')[1].split('```')[0]
            
            return json.loads(content.strip())
            
        except Exception as e:
            logger.error(f"Erro na análise de tendências: {e}")
            return {}
    
    async def get_ai_recommendations(self, user_profile: Dict) -> Dict:
        """Gera recomendações personalizadas baseadas no perfil do usuário"""
        try:
            context = f"""
            RECOMENDAÇÕES PERSONALIZADAS DE MILHAS
            
            PERFIL DO USUÁRIO:
            {json.dumps(user_profile, indent=2)}
            
            DADOS DE MERCADO:
            {json.dumps(self.market_data, indent=2)}
            
            RESPONDA EM JSON COM:
            {{
                "personalized_recommendations": [
                    {{
                        "action": "comprar/vender/aguardar",
                        "program": "nome do programa",
                        "quantity": "quantidade sugerida",
                        "reason": "motivo da recomendação",
                        "confidence": float
                    }}
                ],
                "risk_profile": "conservador/moderado/agressivo",
                "investment_strategy": "descrição da estratégia",
                "alert_settings": {{
                    "price_alerts": boolean,
                    "opportunity_alerts": boolean,
                    "market_change_alerts": boolean
                }}
            }}
            """
            
            response = await self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um consultor financeiro especializado em milhas aéreas."
                    },
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                temperature=0.4,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            
            if '```json' in content:
                content = content.split('```json')[1].split('```')[0]
            elif '```' in content:
                content = content.split('```')[1].split('```')[0]
            
            return json.loads(content.strip())
            
        except Exception as e:
            logger.error(f"Erro nas recomendações: {e}")
            return {}

# Instância global do analisador
ai_analyzer = AIAnalyzer()
