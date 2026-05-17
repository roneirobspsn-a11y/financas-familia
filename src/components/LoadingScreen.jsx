import React from 'react'

export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7F77DD 0%, #1D9E75 100%)',
      color: 'white'
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '1rem',
        animation: 'pulse 2s infinite'
      }}>
        💰
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '0.5rem' }}>
        Finanças da Família
      </h2>
      <p style={{ opacity: 0.9 }}>Carregando...</p>
      <div className="spinner" style={{
        marginTop: '1.5rem',
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTopColor: 'white'
      }}></div>
    </div>
  )
}
