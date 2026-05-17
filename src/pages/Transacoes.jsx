import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, Trash2, Filter, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import toast from 'react-hot-toast'

export default function Transacoes({ session }) {
  const [transacoes, setTransacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [form, setForm] = useState({
    tipo: 'despesa',
    categoria_id: '',
    valor: '',
    descricao: '',
    data_transacao: format(new Date(), 'yyyy-MM-dd'),
    observacoes: ''
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const { data: cats } = await supabase
        .from('categorias')
        .select('*')
        .order('nome')

      const { data: trans } = await supabase
        .from('transacoes')
        .select(`
          *,
          categorias (nome, cor)
        `)
        .order('data_transacao', { ascending: false })
        .limit(100)

      setCategorias(cats || [])
      setTransacoes(trans || [])
      setLoading(false)
    } catch (error) {
      toast.error('Erro ao carregar transações')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const mesRef = format(parseISO(form.data_transacao), 'yyyy-MM')
      const dados = {
        ...form,
        usuario_id: session.user.id,
        mes_referencia: mesRef,
        valor: parseFloat(form.valor)
      }

      if (editando) {
        await supabase
          .from('transacoes')
          .update(dados)
          .eq('id', editando.id)
        toast.success('Transação atualizada!')
      } else {
        await supabase
          .from('transacoes')
          .insert([dados])
        toast.success('Transação criada!')
      }

      setShowModal(false)
      setEditando(null)
      setForm({
        tipo: 'despesa',
        categoria_id: '',
        valor: '',
        descricao: '',
        data_transacao: format(new Date(), 'yyyy-MM-dd'),
        observacoes: ''
      })
      carregarDados()
    } catch (error) {
      toast.error('Erro ao salvar transação')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Confirma exclusão desta transação?')) return

    try {
      await supabase
        .from('transacoes')
        .delete()
        .eq('id', id)
      toast.success('Transação excluída!')
      carregarDados()
    } catch (error) {
      toast.error('Erro ao excluir')
    }
  }

  const transacoesFiltradas = filtroTipo === 'todos' 
    ? transacoes 
    : transacoes.filter(t => t.tipo === filtroTipo)

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Transações
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Gerencie suas receitas e despesas
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Nova Transação
        </button>
      </div>

      <div className="card mb-3">
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${filtroTipo === 'todos' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFiltroTipo('todos')}
          >
            Todas
          </button>
          <button
            className={`btn btn-sm ${filtroTipo === 'receita' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setFiltroTipo('receita')}
          >
            Receitas
          </button>
          <button
            className={`btn btn-sm ${filtroTipo === 'despesa' ? 'btn-accent' : 'btn-outline'}`}
            onClick={() => setFiltroTipo('despesa')}
          >
            Despesas
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center p-4"><div className="spinner" /></div>
        ) : transacoesFiltradas.length === 0 ? (
          <p className="text-center p-4" style={{ color: 'var(--text-secondary)' }}>
            Nenhuma transação encontrada
          </p>
        ) : (
          <div>
            {transacoesFiltradas.map(trans => (
              <div
                key={trans.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '8px',
                    height: '40px',
                    borderRadius: '4px',
                    background: trans.categorias?.cor || '#888'
                  }} />
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {trans.descricao || trans.categorias?.nome}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {trans.categorias?.nome} • {format(parseISO(trans.data_transacao), 'dd/MM/yyyy')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: trans.tipo === 'receita' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {trans.tipo === 'receita' ? '+' : '-'} R$ {parseFloat(trans.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setEditando(trans)
                      setForm({
                        tipo: trans.tipo,
                        categoria_id: trans.categoria_id,
                        valor: trans.valor,
                        descricao: trans.descricao || '',
                        data_transacao: trans.data_transacao,
                        observacoes: trans.observacoes || ''
                      })
                      setShowModal(true)
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(trans.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => {
          setShowModal(false)
          setEditando(null)
        }}>
          <div className="card fade-in" style={{
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              {editando ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={form.tipo}
                  onChange={e => setForm({ ...form, tipo: e.target.value, categoria_id: '' })}
                  required
                >
                  <option value="despesa">Despesa</option>
                  <option value="receita">Receita</option>
                </select>
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={form.categoria_id}
                  onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                  required
                >
                  <option value="">Selecione...</option>
                  {categorias
                    .filter(c => c.tipo === form.tipo && c.ativa)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={form.valor}
                  onChange={e => setForm({ ...form, valor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Conta de luz"
                  value={form.descricao}
                  onChange={e => setForm({ ...form, descricao: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={form.data_transacao}
                  onChange={e => setForm({ ...form, data_transacao: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea
                  rows="3"
                  placeholder="Observações adicionais..."
                  value={form.observacoes}
                  onChange={e => setForm({ ...form, observacoes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner" /> : editando ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowModal(false)
                    setEditando(null)
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
