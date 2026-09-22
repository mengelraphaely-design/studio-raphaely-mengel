import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Sparkles, 
  Calendar, 
  X, 
  Tag, 
  Check, 
  ExternalLink,
  Pencil,
  Gift,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Client, ClientSource } from '../types';
import { openWhatsApp } from '../utils/whatsapp';

export const AdminClients: React.FC = () => {
  const { clients, addClient, updateClient, procedures } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'todos' | 'novas' | 'trafego_pago' | 'indicacao'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states para criação
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [source, setSource] = useState<ClientSource>('trafego_pago');
  const [favoriteProc, setFavoriteProc] = useState(procedures[0]?.name || '');
  const [skinNotes, setSkinNotes] = useState('');

  // Form states para edição
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editSource, setEditSource] = useState<ClientSource>('trafego_pago');
  const [editFavoriteProc, setEditFavoriteProc] = useState('');
  const [editSkinNotes, setEditSkinNotes] = useState('');
  const [editTotalAppointments, setEditTotalAppointments] = useState(0);

  // Filtragem
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    if (!matchesSearch) return false;

    if (sourceFilter === 'novas') return c.isNewClient;
    if (sourceFilter === 'trafego_pago') return c.source === 'trafego_pago';
    if (sourceFilter === 'indicacao') return c.source === 'indicacao';
    return true;
  });

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditPhone(client.phone);
    setEditBirthDate(client.birthDate || '');
    setEditSource(client.source || 'trafego_pago');
    setEditFavoriteProc(client.favoriteProcedures?.[0] || procedures[0]?.name || '');
    setEditSkinNotes(client.skinNotes || '');
    setEditTotalAppointments(client.totalAppointments || 0);
  };

  const handleSaveEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editName.trim() || !editPhone.trim() || !editBirthDate.trim()) return;

    updateClient(editingClient.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      birthDate: editBirthDate.trim(),
      source: editSource,
      favoriteProcedures: [editFavoriteProc],
      skinNotes: editSkinNotes.trim(),
      totalAppointments: Number(editTotalAppointments) || 0
    });

    setEditingClient(null);
    setSuccessMessage(`Cliente ${editName.trim()} atualizada com sucesso!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !birthDate.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    addClient({
      name: name.trim(),
      phone: phone.trim(),
      birthDate: birthDate.trim(),
      firstVisitDate: todayStr,
      lastVisitDate: todayStr,
      source: source,
      isNewClient: true,
      favoriteProcedures: [favoriteProc],
      skinNotes: skinNotes.trim(),
      avatarUrl: '/portfolio/nail-1.jpg',
      totalAppointments: 0,
      totalSpent: 0
    });

    // Resetar
    setShowAddModal(false);
    setName('');
    setPhone('');
    setBirthDate('');
    setSkinNotes('');
    setSuccessMessage(`Cliente ${name.trim()} cadastrada com sucesso!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#2C201C]">
            Gestão de Clientes & Prontuários
          </h3>
          <p className="text-xs text-[#7E706B] mt-0.5">
            Cadastro completo com telefone e nascimento para login facilitado e histórico.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Cliente</span>
        </button>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#FAF6F3] p-3 rounded-2xl border border-[#EFE4DE]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7E706B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#EFE4DE] text-xs text-[#2C201C] focus:outline-none focus:ring-1 focus:ring-[#8B5A51]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSourceFilter('todos')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sourceFilter === 'todos'
                ? 'bg-[#8B5A51] text-white'
                : 'bg-white text-[#7E706B] border border-[#EFE4DE]'
            }`}
          >
            Todas ({clients.length})
          </button>
          <button
            onClick={() => setSourceFilter('novas')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sourceFilter === 'novas'
                ? 'bg-[#8B5A51] text-white'
                : 'bg-white text-[#7E706B] border border-[#EFE4DE]'
            }`}
          >
            Novas Clientes
          </button>
          <button
            onClick={() => setSourceFilter('trafego_pago')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sourceFilter === 'trafego_pago'
                ? 'bg-[#8B5A51] text-white'
                : 'bg-white text-[#7E706B] border border-[#EFE4DE]'
            }`}
          >
            Tráfego Pago
          </button>
          <button
            onClick={() => setSourceFilter('indicacao')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sourceFilter === 'indicacao'
                ? 'bg-[#8B5A51] text-white'
                : 'bg-white text-[#7E706B] border border-[#EFE4DE]'
            }`}
          >
            Indicação
          </button>
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const birthYear = client.birthDate ? parseInt(client.birthDate.split('-')[0], 10) : 0;
          const isConfusedBirthday = birthYear >= 2024;

          return (
            <div
              key={client.id}
              className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
                isConfusedBirthday 
                  ? 'border-amber-300 ring-1 ring-amber-200' 
                  : 'border-[#EFE4DE] hover:border-[#8B5A51]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F4EAE6] text-[#8B5A51] font-serif font-bold flex items-center justify-center border border-[#E8D1CB]">
                      {client.avatarUrl ? (
                        <img src={client.avatarUrl} alt={client.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        client.name[0]
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#2C201C]">{client.name}</h4>
                      <p className="text-xs text-[#7E706B]">{client.phone}</p>
                    </div>
                  </div>

                  {client.isNewClient && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                      Nova!
                    </span>
                  )}
                </div>

                {isConfusedBirthday && (
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span>Ano de nascimento: {birthYear}</span>
                    </div>
                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="underline font-bold hover:text-amber-950"
                    >
                      Corrigir
                    </button>
                  </div>
                )}

                {/* Informações de Cadastro */}
                <div className="bg-[#FAF6F3] p-3 rounded-2xl space-y-1 text-xs text-[#7E706B]">
                  <div className="flex justify-between items-center">
                    <span>Nascimento:</span>
                    <span className="font-semibold text-[#2C201C]">
                      {client.birthDate ? client.birthDate.split('-').reverse().join('/') : 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origem:</span>
                    <span className="capitalize font-medium text-[#8B5A51]">
                      {client.source.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última Visita:</span>
                    <span className="font-medium text-[#2C201C]">
                      {client.lastVisitDate ? client.lastVisitDate.split('-').reverse().join('/') : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atendimentos:</span>
                    <span className="font-medium text-[#2C201C]">
                      {client.totalAppointments || 0} visitas
                    </span>
                  </div>
                  {client.skinNotes && (
                    <p className="text-[11px] pt-1 border-t border-[#EFE4DE] text-[#2C201C]/80 italic">
                      "{client.skinNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Ações: Editar e WhatsApp */}
              <div className="pt-3 mt-3 border-t border-[#EFE4DE] grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenEdit(client)}
                  className="py-2 px-3 rounded-xl bg-[#FAF6F3] hover:bg-amber-100 text-[#8B5A51] hover:text-[#73433a] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#EFE4DE] transition-colors"
                  title="Editar dados da cliente (nome, telefone, nascimento)"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-700" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => openWhatsApp(client.phone, `Olá, ${client.name}! Aqui é a Rapha do Studio Raphaely Mengel.`)}
                  className="py-2 px-3 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal de EDIÇÃO de Cliente Existente */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE4DE] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingClient(null)}
              className="absolute top-5 right-5 p-2 text-[#7E706B] hover:text-[#2C201C] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                Edição de Cadastro
              </span>
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#2C201C] mb-4">
              Editar Dados da Cliente
            </h4>

            <form onSubmit={handleSaveEditClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C] focus:outline-none focus:ring-1 focus:ring-[#8B5A51]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  WhatsApp (com DDD)
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C] focus:outline-none focus:ring-1 focus:ring-[#8B5A51]"
                />
              </div>

              {/* Data de Nascimento com destaque */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#8B5A51] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>Data de Nascimento (Aniversário da Cliente)</span>
                  </label>
                </div>
                <p className="text-[11px] text-[#7E706B] leading-tight">
                  🎂 <strong>Atenção:</strong> Coloque a data em que a cliente <strong>nasceu</strong> (não coloque a data de hoje nem a data de agendamento).
                </p>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  value={editBirthDate}
                  onChange={(e) => setEditBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm text-[#2C201C] focus:outline-none focus:ring-2 focus:ring-[#8B5A51]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                    Origem
                  </label>
                  <select
                    value={editSource}
                    onChange={(e) => setEditSource(e.target.value as ClientSource)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                  >
                    <option value="trafego_pago">Tráfego Pago</option>
                    <option value="instagram">Instagram</option>
                    <option value="indicacao">Indicação</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                    Atendimentos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editTotalAppointments}
                    onChange={(e) => setEditTotalAppointments(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Procedimento de Interesse
                </label>
                <select
                  value={editFavoriteProc}
                  onChange={(e) => setEditFavoriteProc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                >
                  {procedures.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Observações / Prontuário
                </label>
                <textarea
                  rows={2}
                  value={editSkinNotes}
                  onChange={(e) => setEditSkinNotes(e.target.value)}
                  placeholder="Ex: Prefere formato amendoado, cutícula fina..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="flex-1 py-3 rounded-xl bg-[#FAF6F3] text-xs font-semibold text-[#7E706B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-xs font-semibold text-white shadow-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de CADASTRO de Nova Cliente */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE4DE] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 text-[#7E706B] hover:text-[#2C201C] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-serif text-2xl font-bold text-[#2C201C] mb-4">
              Cadastrar Nova Cliente
            </h4>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Amanda Albuquerque"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  WhatsApp (com DDD)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(79) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                />
              </div>

              {/* Data de Nascimento com destaque */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#8B5A51] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>Data de Nascimento (Aniversário da Cliente)</span>
                  </label>
                </div>
                <p className="text-[11px] text-[#7E706B] leading-tight">
                  🎂 <strong>Atenção:</strong> Não coloque a data de hoje! Coloque a data em que a cliente <strong>nasceu</strong>.
                </p>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm text-[#2C201C] focus:outline-none focus:ring-2 focus:ring-[#8B5A51]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Origem da Cliente
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as ClientSource)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                >
                  <option value="trafego_pago">Tráfego Pago (Anúncios Instagram/Google)</option>
                  <option value="instagram">Instagram Orgânico</option>
                  <option value="indicacao">Indicação de Amiga</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Procedimento de Interesse
                </label>
                <select
                  value={favoriteProc}
                  onChange={(e) => setFavoriteProc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                >
                  {procedures.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Observações da Pele / Prontuário
                </label>
                <textarea
                  rows={2}
                  value={skinNotes}
                  onChange={(e) => setSkinNotes(e.target.value)}
                  placeholder="Ex: Pele sensível a ácidos fortes, foco em clareamento de melasma"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#FAF6F3] text-xs font-semibold text-[#7E706B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-xs font-semibold text-white shadow-xs"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
