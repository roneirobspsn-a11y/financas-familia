import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TrendingUp, TrendingDown, DollarSign, Shield, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function Dashboard({ session }) {
  const [stats, setStats] = useState({
    receitaTotal: 0,
    despesaTotal: 0,
    saldo: 0,
    reservaAtual: 0,
    metaReserva: 0
  })
  const [categorias, setCategorias] = useState([])
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const mesAtual = format(new Date(), 'yyyy-MM')

      // Carregar transações do mês
      const { data: transacoes } = await supabase
        .from('transacoes')
        .select('*')
        .eq('mes_referencia', mesAtual)

      const receitas = transacoes?.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + parseFloat(t.valor), 0) || 0
      const despesas = transacoes?.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + parseFloat(t.valor), 0) || 0

      // Carregar meta de emergência
      const { data: metaEmerg } = await supabase
        .from('meta_emergencia')
        .select('*')
        .single()

      // Carregar gastos por categoria
      const { data: categs } = await supabase
        .from('gastos_categoria_mes_atual')
        .select('*')
        .order('total', { ascending: false })
        .limit(5)

      // Carregar notificações não lidas
      const { data: notifs } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('lida', false)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        receitaTotal: receitas,
        despesaTotal: despesas,
        saldo: receitas - despesas,
        reservaAtual: metaEmerg?.valor_atual || 0,
        metaReserva: metaEmerg?.valor_meta || 0
      })

      setCategorias(categs || [])
      setAlertas(notifs || [])
      setLoading(false)
    } catch (error) {
      toast.error('Erro ao carregar dados')
      setLoading(false)
    }
  }

  const percentualReserva = stats.metaReserva > 0 ? (stats.reservaAtual / stats.metaReserva) * 100 : 0

  if (loading) {
    return <div className="text-center p-4"><div className="spinner" /></div>
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="card mb-3" style={{
          background: 'linear-gradient(135deg, #FFF3CD 0%, #FFF8E1 100%)',
          border: '1px solid #FFE4A3'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} color="#856404" />
            <strong style={{ color: '#856404' }}>Alertas importantes</strong>
          </div>
          {alertas.map(alerta => (
            <div key={alerta.id} style={{ fontSize: '0.9rem', color: '#856404', marginBottom: '0.5rem' }}>
              • {alerta.mensagem}
            </div>
          ))}
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid-4 mb-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} color="var(--success)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receitas</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--success)' }}>
            R$ {stats.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} color="var(--danger)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Despesas</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--danger)' }}>
            R$ {stats.despesaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} color={stats.saldo >= 0 ? 'var(--success)' : 'var(--danger)'} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Saldo</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '600', color: stats.saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            R$ {stats.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} color="var(--info)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reserva</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--info)' }}>
            {Math.round(percentualReserva)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            R$ {stats.reservaAtual.toLocaleString('pt-BR')} / R$ {stats.metaReserva.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Gastos por Categoria */}
      <div className="card">
        <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          Top 5 Categorias de Despesas
        </h2>
        {categorias.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            Nenhuma despesa registrada este mês
          </p>
        ) : (
          categorias.map((cat, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem' }}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    background: cat.cor
                  }} />
                  <span style={{ fontWeight: '500' }}>{cat.categoria}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: '600' }}>
                    R$ {parseFloat(cat.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {cat.meta && (
                    <span className={`badge ${parseFloat(cat.percentual_meta) > 100 ? 'badge-danger' : parseFloat(cat.percentual_meta) > 80 ? 'badge-warning' : 'badge-success'}`}>
                      {cat.percentual_meta}%
                    </span>
                  )}
                </div>
              </div>
              <div style={{
                height: '8px',
                background: 'var(--bg-tertiary)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: cat.cor,
                  width: `${Math.min(parseFloat(cat.percentual_meta || 0), 100)}%`,
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
