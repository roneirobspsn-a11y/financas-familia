import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'

// Páginas
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transacoes from './pages/Transacoes'
import Metas from './pages/Metas'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'

// Componentes
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#212529',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#1D9E75',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#E24B4A',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/" replace />}
        />
        
        <Route
          path="/"
          element={
            session ? (
              <Layout session={session}>
                <Dashboard session={session} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="/transacoes"
          element={
            session ? (
              <Layout session={session}>
                <Transacoes session={session} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="/metas"
          element={
            session ? (
              <Layout session={session}>
                <Metas session={session} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="/relatorios"
          element={
            session ? (
              <Layout session={session}>
                <Relatorios session={session} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="/configuracoes"
          element={
            session ? (
              <Layout session={session}>
                <Configuracoes session={session} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
