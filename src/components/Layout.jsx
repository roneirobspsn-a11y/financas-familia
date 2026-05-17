import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Target,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Layout({ children, session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logout realizado com sucesso!')
      navigate('/login')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transações', href: '/transacoes', icon: Receipt },
    { name: 'Metas', href: '/metas', icon: Target },
    { name: 'Relatórios', href: '/relatorios', icon: FileText },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Sidebar Desktop */}
      <aside style={{
        width: '260px',
        background: 'linear-gradient(180deg, #7F77DD 0%, #534AB7 100%)',
        color: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 40
      }} className="sidebar-desktop">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '600' }}>Finanças da Família</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {session?.user?.email}
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  transition: 'var(--transition)',
                  fontWeight: isActive ? '500' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.background = 'transparent'
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'var(--transition)',
            marginTop: 'auto'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            style={{
              width: '260px',
              background: 'linear-gradient(180deg, #7F77DD 0%, #534AB7 100%)',
              color: 'white',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              height: '100vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.3rem', fontWeight: '600' }}>💰 Finanças</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <nav style={{ flex: 1 }}>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '0.5rem',
                      color: 'white',
                      textDecoration: 'none',
                      background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                    }}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <LogOut size={20} />
              Sair
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '260px',
        minHeight: '100vh'
      }} className="main-content">
        {/* Header Mobile */}
        <header style={{
          background: 'white',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }} className="mobile-header">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            className="menu-button"
          >
            <Menu size={24} color="var(--text-primary)" />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Bell size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop {
            display: none;
          }
          .main-content {
            margin-left: 0 !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-header {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
