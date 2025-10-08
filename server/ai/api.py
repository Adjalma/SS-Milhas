"""
API FastAPI para Sistema de IA de Milhas
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import asyncio
import logging
from datetime import datetime

from telegram_monitor import TelegramMonitor
from ai_analyzer import AIAnalyzer
from database import DatabaseManager

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SS Milhas AI API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ss-milhas.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instâncias globais
ai_analyzer = AIAnalyzer()
db_manager = DatabaseManager()
telegram_monitor = None

# Modelos Pydantic
class OpportunityResponse(BaseModel):
    id: str
    timestamp: str
    source: Dict
    analysis: Dict
    confidence: float
    summary: str
    recommendation: str
    risk_level: str

class MarketDataRequest(BaseModel):
    program: str
    days: int = 30

class UserProfileRequest(BaseModel):
    user_id: str
    preferences: Dict
    risk_tolerance: str
    investment_goals: List[str]

class AIAnalysisRequest(BaseModel):
    text: str
    context: Optional[Dict] = None

# Endpoints da API

@app.get("/")
async def root():
    return {
        "message": "SS Milhas AI API",
        "version": "1.0.0",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "ai_analyzer": "online",
            "database": "online",
            "telegram_monitor": "online" if telegram_monitor else "offline"
        }
    }

@app.post("/auth/login")
async def mock_login(credentials: dict):
    """Endpoint mock para login - apenas para teste"""
    return {
        "success": True,
        "data": {
            "user": {
                "id": "1",
                "nome": "Admin",
                "email": "admin@ssmilhas.com",
                "role": "admin"
            },
            "token": "mock_token_123",
            "refreshToken": "mock_refresh_123"
        }
    }

@app.get("/opportunities", response_model=List[OpportunityResponse])
async def get_opportunities(
    limit: int = 50,
    program: Optional[str] = None,
    min_confidence: float = 0.7
):
    """Recupera oportunidades identificadas pela IA"""
    try:
        opportunities = await db_manager.get_opportunities(limit, program, min_confidence)
        return opportunities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_text(request: AIAnalysisRequest):
    """Analisa texto com IA"""
    try:
        # Simula dados de mensagem para análise
        message_data = {
            'text': request.text,
            'channel': 'manual_analysis',
            'author': 'user',
            'date': datetime.now().isoformat(),
            'raw_data': {}
        }
        
        analysis = await ai_analyzer.analyze_opportunity(message_data)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market-data/{program}")
async def get_market_data(program: str, days: int = 30):
    """Recupera dados de mercado históricos"""
    try:
        data = await db_manager.get_market_data(program, days)
        return {
            "program": program,
            "days": days,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/statistics")
async def get_statistics():
    """Recupera estatísticas do sistema"""
    try:
        stats = await db_manager.get_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/user-profile")
async def update_user_profile(request: UserProfileRequest):
    """Atualiza perfil do usuário"""
    try:
        profile_data = {
            'user_id': request.user_id,
            'preferences': request.preferences,
            'risk_tolerance': request.risk_tolerance,
            'investment_goals': request.investment_goals
        }
        
        success = await db_manager.update_user_profile(request.user_id, profile_data)
        if success:
            return {"message": "Perfil atualizado com sucesso"}
        else:
            raise HTTPException(status_code=500, detail="Erro ao atualizar perfil")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user-profile/{user_id}")
async def get_user_profile(user_id: str):
    """Recupera perfil do usuário"""
    try:
        profile = await db_manager.get_user_profile(user_id)
        if profile:
            return profile
        else:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendations/{user_id}")
async def get_ai_recommendations(user_id: str):
    """Gera recomendações personalizadas"""
    try:
        profile = await db_manager.get_user_profile(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
        
        recommendations = await ai_analyzer.get_ai_recommendations(profile)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/market-trends")
async def analyze_market_trends(background_tasks: BackgroundTasks):
    """Analisa tendências do mercado"""
    try:
        # Recupera dados históricos
        historical_data = []
        programs = ['smiles', 'latam', 'tudoazul', 'livelo', 'iberia', 'avios']
        
        for program in programs:
            data = await db_manager.get_market_data(program, 30)
            historical_data.extend(data)
        
        # Analisa com IA
        trends = await ai_analyzer.analyze_market_trends(historical_data)
        
        # Salva análise
        background_tasks.add_task(
            db_manager.save_ai_analysis,
            {
                'type': 'market_trends',
                'data': trends,
                'timestamp': datetime.now()
            }
        )
        
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/start-monitor")
async def start_telegram_monitor(background_tasks: BackgroundTasks):
    """Inicia monitoramento do Telegram"""
    global telegram_monitor
    
    if telegram_monitor:
        return {"message": "Monitor já está rodando"}
    
    try:
        telegram_monitor = TelegramMonitor()
        background_tasks.add_task(telegram_monitor.start)
        return {"message": "Monitor iniciado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop-monitor")
async def stop_telegram_monitor():
    """Para monitoramento do Telegram"""
    global telegram_monitor
    
    if telegram_monitor:
        await telegram_monitor.client.disconnect()
        telegram_monitor = None
        return {"message": "Monitor parado com sucesso"}
    else:
        return {"message": "Monitor não estava rodando"}

@app.post("/cleanup")
async def cleanup_old_data(days: int = 90):
    """Limpa dados antigos"""
    try:
        await db_manager.cleanup_old_data(days)
        return {"message": f"Dados antigos (>{days} dias) removidos com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Eventos da aplicação
@app.on_event("startup")
async def startup_event():
    """Inicializa serviços na startup"""
    logger.info("Iniciando SS Milhas AI API...")
    
    # Inicia monitoramento em background
    global telegram_monitor
    try:
        telegram_monitor = TelegramMonitor()
        # Não iniciamos automaticamente para evitar problemas de conexão
        logger.info("Telegram Monitor configurado (não iniciado automaticamente)")
    except Exception as e:
        logger.error(f"Erro ao configurar Telegram Monitor: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Limpa recursos na shutdown"""
    global telegram_monitor
    if telegram_monitor:
        await telegram_monitor.client.disconnect()
    
    await db_manager.close()
    logger.info("SS Milhas AI API finalizada")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
