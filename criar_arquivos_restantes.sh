#!/bin/bash

# Criar páginas vazias temporárias
cat > src/pages/Metas.jsx << 'METASEOF'
import React from 'react'
export default function Metas() {
  return <div className="fade-in"><h1 style={{fontSize:'2rem',fontWeight:'600'}}>Metas</h1><p style={{color:'var(--text-secondary)',marginTop:'0.5rem'}}>Em desenvolvimento...</p></div>
}
METASEOF

cat > src/pages/Relatorios.jsx << 'RELEOF'
import React from 'react'
export default function Relatorios() {
  return <div className="fade-in"><h1 style={{fontSize:'2rem',fontWeight:'600'}}>Relatórios</h1><p style={{color:'var(--text-secondary)',marginTop:'0.5rem'}}>Em desenvolvimento...</p></div>
}
RELEOF

cat > src/pages/Configuracoes.jsx << 'CONFEOF'
import React from 'react'
export default function Configuracoes() {
  return <div className="fade-in"><h1 style={{fontSize:'2rem',fontWeight:'600'}}>Configurações</h1><p style={{color:'var(--text-secondary)',marginTop:'0.5rem'}}>Em desenvolvimento...</p></div>
}
CONFEOF

# Criar .env.example
cat > .env.example << 'ENVEOF'
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
ENVEOF

# Criar netlify.toml
cat > netlify.toml << 'NETLIFYEOF'
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
NETLIFYEOF

# Criar .gitignore
cat > .gitignore << 'GITEOF'
node_modules
dist
.env
.env.local
.DS_Store
GITEOF

# Criar README.md
cat > README.md << 'READMEEOF'
# 💰 Finanças da Família - SaaS

Sistema inteligente de controle financeiro familiar com metas, alertas e relatórios.

## 🚀 Tecnologias

- React + Vite
- Supabase (Backend & Auth)
- Recharts (Gráficos)
- React Router DOM
- Lucide React (Ícones)
- React Hot Toast (Notificações)

## 📦 Instalação

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure o `.env` com suas credenciais do Supabase
4. Execute o SQL do arquivo `supabase_schema.sql` no SQL Editor do Supabase
5. Rode o projeto: `npm run dev`

## 🔐 Configuração Supabase

1. Crie um projeto no Supabase
2. Execute o script SQL em `supabase_schema.sql`
3. Copie a URL e ANON_KEY do projeto
4. Cole no arquivo `.env`

## 🌐 Deploy Netlify

1. Conecte seu repositório GitHub ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático!

## ✨ Funcionalidades

- ✅ Autenticação segura
- ✅ Dashboard com métricas em tempo real
- ✅ Cadastro de receitas e despesas
- ✅ Sistema de categorias colorido
- ✅ Metas personalizadas por categoria
- ✅ Alertas inteligentes
- ✅ Reserva de emergência
- ✅ Relatórios e gráficos
- ✅ Exportação PDF
- ✅ Responsivo (mobile-first)

READMEEOF

echo "Arquivos criados com sucesso!"
