# 🚀 Guia de Configuração - Sistema de IA

## 📋 Pré-requisitos

### 1. Python 3.11+
```bash
# Verificar versão
python --version

# Instalar Python 3.11 se necessário
# Windows: https://www.python.org/downloads/
# macOS: brew install python@3.11
# Linux: sudo apt install python3.11
```

### 2. Credenciais Necessárias

#### OpenAI API Key
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie a chave (começa com `sk-`)

#### Telegram API
1. Acesse: https://my.telegram.org/auth
2. Faça login com seu número de telefone
3. Vá em "API Development Tools"
4. Crie uma nova aplicação
5. Anote o `api_id` e `api_hash`

#### MongoDB
- Use a mesma conexão do sistema principal
- Ou crie um novo cluster em: https://cloud.mongodb.com

## ⚙️ Configuração Passo a Passo

### 1. Instalar Dependências
```bash
cd server/ai
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais
nano .env
```

**Exemplo de .env:**
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Telegram Configuration
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=your_telegram_api_hash_here
TELEGRAM_PHONE=+5511999999999

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ss-milhas-ai?retryWrites=true&w=majority

# Redis Configuration (opcional)
REDIS_URL=redis://localhost:6379
```

### 3. Configurar Canais do Telegram

#### Canais Recomendados:
- `@BANCO_DE_MILHAS_ON_FIRE`
- `@BALCAO_DE_MILHAS_COMPRAS`
- `@BALCAO_DE_MILHAS_COMP`
- `@BALCAO_DE_MILHAS_ASM`

#### Como Adicionar Canais:
1. Entre nos canais do Telegram
2. Anote o nome exato do canal
3. Adicione no arquivo `config.py`

### 4. Testar Conexões

#### Teste OpenAI:
```bash
python -c "
from openai import AsyncOpenAI
import asyncio

async def test():
    client = AsyncOpenAI(api_key='sua-api-key')
    response = await client.chat.completions.create(
        model='gpt-4',
        messages=[{'role': 'user', 'content': 'Hello'}]
    )
    print('OpenAI OK:', response.choices[0].message.content[:50])

asyncio.run(test())
"
```

#### Teste Telegram:
```bash
python -c "
from telethon import TelegramClient
import asyncio

async def test():
    client = TelegramClient('test', api_id, api_hash)
    await client.start()
    print('Telegram OK:', await client.get_me())
    await client.disconnect()

asyncio.run(test())
"
```

#### Teste MongoDB:
```bash
python -c "
import motor.motor_asyncio
import asyncio

async def test():
    client = motor.motor_asyncio.AsyncIOMotorClient('sua-mongodb-uri')
    await client.admin.command('ping')
    print('MongoDB OK')

asyncio.run(test())
"
```

## 🚀 Inicialização

### Modo Desenvolvimento
```bash
# Terminal 1: Sistema principal
npm run dev

# Terminal 2: Sistema IA
npm run ai:dev
```

### Modo Produção
```bash
# Sistema completo
npm run dev:ai
```

## 📊 Verificar Funcionamento

### 1. API IA
- Acesse: http://localhost:8000/docs
- Teste endpoint: `GET /health`

### 2. Dashboard IA
- Acesse: http://localhost:3000/ai/dashboard
- Verifique se as oportunidades aparecem

### 3. Logs
```bash
# Ver logs do sistema IA
tail -f server/ai/logs/ai_system.log
```

## 🔧 Troubleshooting

### Erro: "Telegram API ID/Hash inválidos"
- Verifique se copiou corretamente
- Certifique-se que a aplicação está ativa no Telegram

### Erro: "OpenAI API Key inválida"
- Verifique se tem créditos na conta OpenAI
- Confirme se a chave está correta

### Erro: "Canal não encontrado"
- Verifique se o nome do canal está correto
- Certifique-se que você tem acesso ao canal

### Erro: "MongoDB connection failed"
- Verifique a string de conexão
- Confirme se o IP está liberado no MongoDB Atlas

## 📈 Monitoramento

### Métricas Importantes:
- **Mensagens processadas/hora**
- **Oportunidades identificadas**
- **Taxa de precisão da IA**
- **Uptime do sistema**

### Alertas Configuráveis:
- Sistema offline
- Taxa de erro alta
- Muitas oportunidades falsas
- Problemas de conexão

## 🎯 Próximos Passos

1. **Configurar notificações** por email/SMS
2. **Ajustar parâmetros** de análise
3. **Adicionar mais canais** do Telegram
4. **Treinar modelo** com dados específicos
5. **Implementar alertas** personalizados

---

**💡 Dica:** Comece com poucos canais para testar, depois expanda gradualmente!
