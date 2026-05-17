import React, { useState } from 'react'
import { supabase, upsertProfile } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nome: formData.nome
            }
          }
        })

        if (error) throw error

        // Criar perfil
        if (data.user) {
          await upsertProfile(data.user.id, {
            nome: formData.nome,
            email: formData.email
          })
        }

        toast.success('Conta criada! Verifique seu email para confirmar.')
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) throw error
        toast.success('Login realizado com sucesso!')
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao processar sua solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #7F77DD 0%, #1D9E75 100%)',
      padding: '2rem'
    }}>
      <div className="card fade-in" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Finanças da Família
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isSignUp ? 'Criar sua conta' : 'Bem-vindo de volta!'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label>
                <UserPlus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : isSignUp ? (
              <>
                <UserPlus size={18} />
                Criar conta
              </>
            ) : (
              <>
                <LogIn size={18} />
                Entrar
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  )
}
