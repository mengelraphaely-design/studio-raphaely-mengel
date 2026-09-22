import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction, TransactionCategory } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Receipt
} from 'lucide-react';

export const AdminFinancial: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useApp();

  const [dateFilter, setDateFilter] = useState<'hoje' | '7dias' | 'mes' | 'todos'>('mes');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'receita' | 'despesa'>('todos');
  
  // Modal de Nova Transação
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState<'receita' | 'despesa'>('receita');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<TransactionCategory>('atendimento');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  // Filtrar transações por período
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const today = new Date();
    
    if (dateFilter === 'hoje') {
      const todayStr = today.toISOString().split('T')[0];
      if (tx.date !== todayStr) return false;
    } else if (dateFilter === '7dias') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      if (txDate < sevenDaysAgo) return false;
    } else if (dateFilter === 'mes') {
      // Filtrar pelo mês atual
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      if (txDate.getMonth() !== currentMonth || txDate.getFullYear() !== currentYear) {
        // Mantém dados de demonstração do mês de setembro
        const isSep2026 = tx.date.startsWith('2026-09');
        if (!isSep2026) return false;
      }
    }

    if (typeFilter !== 'todos' && tx.type !== typeFilter) {
      return false;
    }

    return true;
  });

  // Cálculos Financeiros
  const receitas = filteredTransactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const despesas = filteredTransactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => acc + t.amount, 0);

  const resultado = receitas - despesas;
  
  const atendimentosPagos = filteredTransactions.filter(
    t => t.type === 'receita' && t.category === 'atendimento'
  );
  const ticketMedio = atendimentosPagos.length > 0 
    ? Math.round(receitas / atendimentosPagos.length) 
    : 0;

  // Distribuição de Despesas por Categoria
  const despesasPorCategoria: Record<TransactionCategory, number> = {
    aluguel: 0,
    materiais: 0,
    energia: 0,
    marketing: 0,
    outros: 0,
    atendimento: 0
  };

  filteredTransactions
    .filter(t => t.type === 'despesa')
    .forEach(t => {
      despesasPorCategoria[t.category] = (despesasPorCategoria[t.category] || 0) + t.amount;
    });

  const categoryLabels: Record<TransactionCategory, { label: string; color: string }> = {
    aluguel: { label: 'Aluguel & Espaço', color: 'bg-rose-500' },
    materiais: { label: 'Materiais & Produtos', color: 'bg-amber-500' },
    energia: { label: 'Energia & Água', color: 'bg-blue-500' },
    marketing: { label: 'Marketing & Tráfego', color: 'bg-purple-500' },
    outros: { label: 'Outros Custos', color: 'bg-neutral-500' },
    atendimento: { label: 'Atendimentos', color: 'bg-emerald-500' }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim() || !newAmount || isNaN(Number(newAmount))) return;

    addTransaction({
      type: newType,
      description: newDescription.trim(),
      amount: parseFloat(newAmount),
      category: newCategory,
      date: newDate
    });

    // Resetar
    setShowModal(false);
    setNewDescription('');
    setNewAmount('');
    setNewCategory(newType === 'receita' ? 'atendimento' : 'materiais');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider">
            Painel de Lucratividade & Fluxo de Caixa
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-0.5">
            Controle Financeiro
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Filtro de Período */}
          <div className="flex bg-[#FAF6F3] p-1 rounded-xl border border-[#EFE4DE] text-xs font-semibold">
            <button
              onClick={() => setDateFilter('hoje')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'hoje' ? 'bg-[#8B5A51] text-white shadow-xs' : 'text-[#7E706B] hover:text-[#2C201C]'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setDateFilter('7dias')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === '7dias' ? 'bg-[#8B5A51] text-white shadow-xs' : 'text-[#7E706B] hover:text-[#2C201C]'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setDateFilter('mes')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'mes' ? 'bg-[#8B5A51] text-white shadow-xs' : 'text-[#7E706B] hover:text-[#2C201C]'
              }`}
            >
              Este mês
            </button>
            <button
              onClick={() => setDateFilter('todos')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'todos' ? 'bg-[#8B5A51] text-white shadow-xs' : 'text-[#7E706B] hover:text-[#2C201C]'
              }`}
            >
              Todos
            </button>
          </div>

          {/* Botão Nova Transação */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Métricas idênticos ao Lovable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Faturamento */}
        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Faturamento do mês</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            R$ {receitas.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>▲ 64% vs. período anterior</span>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Despesas do mês</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            R$ {despesas.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>▲ 89% vs. período anterior</span>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resultado</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`font-serif text-2xl sm:text-3xl font-bold ${resultado >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {resultado < 0 ? `-R$ ${Math.abs(resultado).toLocaleString('pt-BR')}` : `R$ ${resultado.toLocaleString('pt-BR')}`}
          </div>
          <div className="text-[11px] text-[#7E706B] font-medium mt-1">
            Sobra {receitas > 0 ? `${Math.round((resultado / receitas) * 100)}%` : '0%'} do que entrou
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ticket médio</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6F3] text-[#8B5A51] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            R$ {ticketMedio}
          </div>
          <div className="text-[11px] text-[#7E706B] font-medium mt-1">
            {atendimentosPagos.length} atendimentos pagos
          </div>
        </div>

      </div>

      {/* Resumo em palavras simples (Texto Exato do Lovable) */}
      <div className="bg-[#FAF6F3] border border-[#E8D1CB] rounded-3xl p-5 text-[#2C201C] space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B5A51]">
          Resumo em palavras simples
        </h4>
        <p className="text-xs sm:text-sm leading-relaxed text-[#2C201C]/90">
          Neste mês, você atendeu <strong>{atendimentosPagos.length} clientes</strong> e faturou <strong>R$ {receitas.toLocaleString('pt-BR')}</strong>, com ticket médio de <strong>R$ {ticketMedio}</strong>. As despesas somaram <strong>R$ {despesas.toLocaleString('pt-BR')}</strong>, resultando em um saldo líquido de <strong className={resultado < 0 ? 'text-rose-700' : 'text-emerald-700'}>{resultado < 0 ? `-R$ ${Math.abs(resultado).toLocaleString('pt-BR')}` : `R$ ${resultado.toLocaleString('pt-BR')}`}</strong> devido aos investimentos em estrutura, aluguel e reposição de materiais.
        </p>
      </div>

      {/* Gráfico / Barras de Gastos por Categoria */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2C201C]">
              Onde o dinheiro foi gasto
            </h4>
            <p className="text-xs text-[#7E706B]">
              Distribuição percentual das despesas deste período
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Total Despesas: R$ {despesas.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {(['aluguel', 'outros', 'materiais', 'energia', 'marketing'] as TransactionCategory[]).map((cat) => {
            const amount = despesasPorCategoria[cat] || 0;
            const pct = despesas > 0 ? Math.round((amount / despesas) * 100) : 0;
            const meta = categoryLabels[cat];

            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#2C201C] font-semibold">{meta.label}</span>
                  <span className="text-[#7E706B]">
                    R$ {amount.toLocaleString('pt-BR')} <strong className="text-[#2C201C]">({pct}%)</strong>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#FAF6F3] rounded-full overflow-hidden border border-[#EFE4DE]">
                  <div 
                    className={`h-full ${meta.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE4DE]">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2C201C]">
              Histórico de Entradas e Saídas
            </h4>
            <p className="text-xs text-[#7E706B]">
              {filteredTransactions.length} lançamentos encontrados
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('todos')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                typeFilter === 'todos' ? 'bg-[#2C201C] text-white' : 'bg-[#FAF6F3] text-[#7E706B]'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTypeFilter('receita')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                typeFilter === 'receita' ? 'bg-emerald-600 text-white' : 'bg-[#FAF6F3] text-[#7E706B]'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setTypeFilter('despesa')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                typeFilter === 'despesa' ? 'bg-rose-600 text-white' : 'bg-[#FAF6F3] text-[#7E706B]'
              }`}
            >
              Despesas
            </button>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-[#EFE4DE]">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'receita' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {tx.type === 'receita' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-[#2C201C] truncate">{tx.description}</h5>
                    <p className="text-[11px] text-[#7E706B]">
                      {tx.date.split('-').reverse().join('/')} • {categoryLabels[tx.category]?.label || tx.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-serif text-sm sm:text-base font-bold ${
                    tx.type === 'receita' ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {tx.type === 'receita' ? `+R$ ${tx.amount.toLocaleString('pt-BR')}` : `-R$ ${tx.amount.toLocaleString('pt-BR')}`}
                  </span>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    title="Excluir lançamento"
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-xs text-[#7E706B]">
            Nenhum lançamento financeiro para o filtro selecionado.
          </p>
        )}
      </div>

      {/* MODAL: Novo Lançamento */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
              <h3 className="font-serif text-lg font-bold text-[#2C201C]">
                Novo Lançamento Financeiro
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-[#7E706B] hover:bg-[#FAF6F3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              {/* Tipo: Receita ou Despesa */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewType('receita');
                    setNewCategory('atendimento');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    newType === 'receita' 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-[#FAF6F3] text-[#7E706B] border-[#EFE4DE]'
                  }`}
                >
                  + Receita (Entrada)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewType('despesa');
                    setNewCategory('materiais');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    newType === 'despesa' 
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                      : 'bg-[#FAF6F3] text-[#7E706B] border-[#EFE4DE]'
                  }`}
                >
                  - Despesa (Saída)
                </button>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'receita' ? 'Ex: Alongamento - Amanda Silva' : 'Ex: Reposição de Gel e Lixas'}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                />
              </div>

              {/* Valor e Categoria */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#EFE4DE] bg-white focus:outline-hidden focus:border-[#8B5A51]"
                  >
                    {newType === 'receita' ? (
                      <>
                        <option value="atendimento">Atendimento</option>
                        <option value="outros">Outros Ganhos</option>
                      </>
                    ) : (
                      <>
                        <option value="materiais">Materiais & Produtos</option>
                        <option value="aluguel">Aluguel & Espaço</option>
                        <option value="energia">Energia & Água</option>
                        <option value="marketing">Marketing & Tráfego</option>
                        <option value="outros">Outros Custos</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Data */}
              <div>
                <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                />
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-[#EFE4DE] text-[#7E706B] hover:bg-[#FAF6F3]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white shadow-xs"
                >
                  Registrar Lançamento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
