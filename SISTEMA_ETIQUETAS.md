# Sistema de Etiquetas - Informações Importantes

## 📌 Visão Geral

Sistema de etiquetas para marcar informações importantes nos cards de CPFs e Programas, com indicadores visuais e tooltips informativos.

## ✨ Funcionalidades Implementadas

### 1. **Campo de Etiquetas nos Cards**
- Campo editável em cada card de programa
- Localizado abaixo do botão de favoritar
- Permite adicionar informações importantes sobre cada conta

### 2. **Indicador Visual no Dashboard**
- Ícone de informação (ℹ️) com badge de alerta (!)
- Animação pulsante para chamar atenção
- Cor laranja (#FFA726) para destacar

### 3. **Tooltip Informativo**
- Ao passar o mouse sobre o ícone, mostra a mensagem completa
- Tooltip com seta indicativa
- Posicionamento inteligente

### 4. **Interface de Edição**
- Clique no campo para editar
- Campo de texto multilinha (2 linhas)
- Botões de Salvar e Cancelar
- Preview da mensagem quando não está editando

## 🎯 Onde Encontrar

### **Controle de Programas** (`/dashboard/controle-programas`)
- Campo de etiqueta em cada card de programa
- Indicador visual no nome quando há etiqueta
- Tooltip ao passar o mouse

### **Controle de CPF** (`/dashboard/controle-cpf`)
- Campo de etiqueta em cada card de CPF
- Indicador visual no nome quando há etiqueta
- Tooltip ao passar o mouse
- Coluna de etiquetas na tabela de gerenciamento

## 🎨 Aparência Visual

### **Sem Etiqueta:**
```
┌─────────────────────────────┐
│ Clique para adicionar       │
│ informação importante       │
└─────────────────────────────┘
```
- Borda tracejada cinza
- Fundo transparente
- Texto em cinza claro

### **Com Etiqueta:**
```
┌─────────────────────────────┐
│ ℹ️ Informação Importante     │
│ Conta com limite próximo... │
└─────────────────────────────┘
```
- Borda tracejada laranja
- Fundo laranja translúcido
- Ícone de informação
- Preview do texto (máx. 50 caracteres)

### **Indicador no Nome:**
```
THYAGO  ⚠️!
```
- Badge com "!" pulsante
- Ícone de informação laranja
- Tooltip com mensagem completa

## 💡 Exemplos de Uso

### **Exemplo 1: Limite de Vencimento**
```
Etiqueta: "Conta com limite próximo do vencimento - renovar até 31/12/2024"
```
- Alerta sobre renovação de limite anual
- Data específica de vencimento
- Visível no card e no tooltip

### **Exemplo 2: Regra Especial**
```
Etiqueta: "Beneficiário fixo - alteração só após 60 dias"
```
- Informação sobre regra do programa
- Restrição de alteração
- Importante para operação

### **Exemplo 3: Alerta Crítico**
```
Etiqueta: "ATENÇÃO: Apenas 2 CPFs restantes! Usar com cuidado"
```
- Alerta de limite crítico
- Uso em maiúsculas para ênfase
- Orientação de uso

## 🔧 Como Usar

### **Adicionar Etiqueta:**
1. Clique no campo "Clique para adicionar informação importante"
2. Digite a informação no campo de texto
3. Clique em "Salvar"

### **Editar Etiqueta:**
1. Clique no campo com a etiqueta existente
2. Modifique o texto
3. Clique em "Salvar" ou "Cancelar"

### **Visualizar Etiqueta Completa:**
1. Passe o mouse sobre o ícone ℹ️ no nome
2. O tooltip mostrará a mensagem completa

### **Remover Etiqueta:**
1. Clique no campo com a etiqueta
2. Apague todo o texto
3. Clique em "Salvar"

## 📊 Integração com Dados

### **Estrutura de Dados:**
```javascript
{
  id: 1,
  nome: 'THYAGO',
  programa: 'Smiles (GOL)',
  etiqueta: 'Conta com limite próximo do vencimento - renovar até 31/12/2024'
}
```

### **Persistência:**
- ✅ **localStorage:** As etiquetas são salvas automaticamente no navegador
- ✅ **Persistência entre sessões:** Dados mantidos mesmo após fechar o navegador
- ✅ **Sincronização automática:** Salva a cada alteração
- ✅ **Chaves separadas:** 
  - `etiquetas_programas` para Controle de Programas
  - `etiquetas_cpf` para Monitoramento de CPF
- 🔄 **Futuro:** Sincronização com banco de dados

## 🎯 Casos de Uso

### **1. Alertas de Vencimento**
- Informar sobre limites que vão renovar
- Datas importantes de renovação
- Prazos de alteração

### **2. Regras Especiais**
- Restrições de uso
- Beneficiários fixos
- Limitações específicas

### **3. Observações Operacionais**
- Problemas conhecidos
- Instruções especiais
- Histórico importante

### **4. Status Temporários**
- Contas em análise
- Aguardando documentação
- Em processo de atualização

## 🔄 Sincronização

### **Controle de Programas ↔ Controle de CPF**
- As etiquetas são compartilhadas entre as páginas
- Alterações em uma página refletem na outra
- Dados sincronizados em tempo real

## 🎨 Personalização

### **Cores:**
- **Laranja (#FFA726):** Informação importante
- **Amarelo:** Alerta
- **Vermelho:** Crítico (futuro)
- **Azul:** Informativo (futuro)

### **Animações:**
- Pulse no badge (2s)
- Hover no campo (0.3s)
- Transições suaves

## 📱 Responsividade

- Campo se adapta ao tamanho do card
- Tooltip posicionado automaticamente
- Texto truncado em telas pequenas

## 🚀 Melhorias Futuras

1. **Categorias de Etiquetas:**
   - Urgente, Importante, Informativo
   - Cores diferentes por categoria

2. **Histórico de Etiquetas:**
   - Registro de alterações
   - Quem alterou e quando

3. **Notificações:**
   - Alertas automáticos
   - Lembretes de vencimento

4. **Filtros:**
   - Filtrar por etiquetas
   - Buscar por conteúdo

5. **Templates:**
   - Etiquetas predefinidas
   - Sugestões automáticas

## ✅ Pronto para Uso!

O sistema de etiquetas está totalmente funcional e pronto para uso em produção!
