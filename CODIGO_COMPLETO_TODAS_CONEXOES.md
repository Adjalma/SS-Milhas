# 🚀 CÓDIGO COMPLETO PARA CONECTAR TODAS AS PÁGINAS

**Status:** 4/22 conectadas | Faltam: 18 páginas

Este documento contém TODO o código necessário para conectar as 18 páginas restantes.

---

## ✅ JÁ CONECTADAS

1. ✅ Receitas
2. ✅ Despesas  
3. ✅ Fluxo de Caixa
4. ✅ Tarefas

---

## 📝 CÓDIGO PARA CADA PÁGINA RESTANTE

### 5. DASHBOARD (`client/src/pages/Dashboard/Dashboard.js`)

```javascript
// Adicionar após imports existentes:
import { dashboardAPI, financialAPI, movementAPI } from '../../services';

// No componente, substituir useState:
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Adicionar useEffect:
React.useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, metricsRes] = await Promise.all([
        dashboardAPI.getDashboardStats(),
        financialAPI.getFinancialSummary()
      ]);
      setStats({
        ...statsRes.stats,
        ...metricsRes.summary
      });
    } catch (err) {
      setError('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };
  fetchDashboard();
}, []);
```

### 6-14. MOVIMENTAÇÕES (9 arquivos)

**Padrão para TODAS as movimentações:**

```javascript
// Import
import { movementAPI } from '../../services';

// Estado
const [movements, setMovements] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch
React.useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const res = await movementAPI.getMovements({ tipo: 'TIPO_AQUI' });
      setMovements(res.movements || []);
    } catch (err) {
      setError('Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

// Submit
const handleSubmit = async (formData) => {
  try {
    await movementAPI.createMovement({
      tipo: 'TIPO_AQUI', // compra, venda, transferencia, etc
      ...formData
    });
    await fetch(); // recarregar
  } catch (err) {
    setError(err.response?.data?.message || 'Erro');
  }
};
```

#### 6. Compra/Entrada (`client/src/pages/Movimentacoes/CompraEntrada.js`)
- tipo: `'compra'`

#### 7. Venda (`client/src/pages/Movimentacoes/Venda.js`)
- tipo: `'venda'`

#### 8. Transferência (`client/src/pages/Movimentacoes/Transferencia.js`)
- tipo: `'transferencia'`

#### 9. Compra Bonificada (`client/src/pages/Movimentacoes/CompraBonificada.js`)
- tipo: `'compra'`, adicionar: `bonificada: true`

#### 10. Transferência Pessoas (`client/src/pages/Movimentacoes/TransferenciaPessoas.js`)
- tipo: `'transferencia'`

#### 11. Agendamento (`client/src/pages/Movimentacoes/Agendamento.js`)
```javascript
import { movementAPI } from '../../services';

const [agendamentos, setAgendamentos] = useState([]);

React.useEffect(() => {
  const fetch = async () => {
    const res = await movementAPI.getScheduledTransactions();
    setAgendamentos(res.scheduled || []);
  };
  fetch();
}, []);

const handleCreate = async (data) => {
  await movementAPI.createScheduledTransaction(data);
  await fetch();
};
```

#### 12. Processos (`client/src/pages/Movimentacoes/Processos.js`)
```javascript
import { movementAPI } from '../../services';

const res = await movementAPI.getMovements({ status: 'pendente' });
setProcessos(res.movements || []);
```

#### 13. Saída Manual (`client/src/pages/Movimentacoes/SaidaManual.js`)
- tipo: `'saida_manual'`

#### 14. Passagem (`client/src/pages/Movimentacoes/Passagem.js`)
- tipo: `'passagem'`

### 15-21. RELATÓRIOS (7 arquivos)

**Padrão para relatórios:**

```javascript
import { reportAPI } from '../../services';

const [reportData, setReportData] = useState(null);
const [loading, setLoading] = useState(true);

React.useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const res = await reportAPI.METODO_AQUI(filters);
      setReportData(res.report || {});
    } catch (err) {
      setError('Erro');
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, [filters]);
```

#### 15. Controle CPF (`client/src/pages/Relatorios/ControleCPF.js`)
```javascript
const res = await reportAPI.getCPFControlReport();
```

#### 16. Passagens (`client/src/pages/Relatorios/Passagens.js`)
```javascript
const res = await reportAPI.getTicketsReport(filters);
```

#### 17. Transferências (`client/src/pages/Relatorios/Transferencias.js`)
```javascript
const res = await reportAPI.getTransfersReport(filters);
```

#### 18. Vendas (`client/src/pages/Relatorios/Vendas.js`)
```javascript
const res = await reportAPI.getSalesReport(filters);
```

#### 19. Resumo (`client/src/pages/Relatorios/Resumo.js`)
```javascript
import { financialAPI } from '../../services';

const res = await financialAPI.getFinancialSummary(startDate, endDate);
```

#### 20. Gráfico Lucro (`client/src/pages/Relatorios/GraficoLucro.js`)
```javascript
const res = await reportAPI.getProfitReport(period);
setChartData(res.data || []);
```

#### 21. Evolução (`client/src/pages/Relatorios/Evolucao.js`)
```javascript
import { dashboardAPI } from '../../services';

const res = await dashboardAPI.getEvolutionChartData(period);
```

### 22. CONCILIAÇÃO (`client/src/pages/Financeiro/Conciliacao.js`)

```javascript
import { financialAPI } from '../../services';

const [bankAccounts, setBankAccounts] = useState([]);
const [cards, setCards] = useState([]);

React.useEffect(() => {
  const fetch = async () => {
    try {
      const [accountsRes, cardsRes] = await Promise.all([
        financialAPI.getBankAccounts(),
        financialAPI.getCards()
      ]);
      setBankAccounts(accountsRes.accounts || []);
      setCards(cardsRes.cards || []);
    } catch (err) {
      setError('Erro');
    }
  };
  fetch();
}, []);
```

---

## ⚡ APLICAÇÃO RÁPIDA

Para cada arquivo, seguir estes 4 passos:

### 1️⃣ Adicionar Import
```javascript
import { API_NECESSARIA } from '../../services';
```

### 2️⃣ Modificar Estado
```javascript
// ANTES:
const [data] = useState([...mock...]);

// DEPOIS:
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 3️⃣ Adicionar useEffect
```javascript
React.useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const res = await API.method();
      setData(res.data || []);
    } catch (err) {
      setError('Erro');
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

### 4️⃣ Atualizar handleSubmit
```javascript
const handleSubmit = async (formData) => {
  try {
    await API.createMethod(formData);
    await fetch();
  } catch (err) {
    setError(err.response?.data?.message || 'Erro');
  }
};
```

---

## 📊 PROGRESSO

- ✅ Conectadas: 4/22 (18%)
- ⏳ Restantes: 18 (82%)
- ⏱️ Tempo estimado: 3-4 horas para todas

---

**TODO O CÓDIGO NECESSÁRIO ESTÁ AQUI!**  
Basta copiar e aplicar em cada arquivo! 🚀

