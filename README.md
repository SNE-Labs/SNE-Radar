# SNE Radar

Sistema de análise técnica e gráfica para criptomoedas, integrado ao ecossistema SNE Labs.

## 📋 Sobre

O SNE Radar é uma plataforma web de análise técnica avançada que oferece:

- **Dashboard em tempo real** com métricas de mercado
- **Gráficos interativos** com TradingView Lightweight Charts
- **Análise técnica automatizada** com múltiplos indicadores
- **Sistema de alertas** personalizáveis
- **Integração com WalletConnect** para autenticação via carteira
- **Verificação on-chain** de licenças via smart contract (Scroll L2)

## 🏗️ Arquitetura

- **Frontend:** Vue.js 3 + TypeScript + Vite (deploy no Vercel)
- **Backend:** Flask + Socket.IO (deploy no GCP Cloud Run)
- **Database:** PostgreSQL (GCP Cloud SQL) + Redis (cache)
- **Blockchain:** Scroll L2 (Sepolia Testnet → Mainnet)
- **Autenticação:** SIWE (Sign-In with Ethereum) + EIP-1271

## 📚 Documentação

### Plano de Deploy Completo

Consulte o arquivo [`PLANO_DEPLOY_COMPLETO_SNE_RADAR.md`](./PLANO_DEPLOY_COMPLETO_SNE_RADAR.md) para:

- Arquitetura detalhada
- Guia de implementação passo a passo
- Configuração de infraestrutura (GCP + Vercel)
- Integração com smart contracts
- Sistema de monetização (Free, Premium, Pro)
- Hardening e segurança
- Observabilidade e monitoramento

### Arquitetura do Ecossistema

Consulte [`ARQUITETURA_ECOSSISTEMA_SNE_LABS.md`](./ARQUITETURA_ECOSSISTEMA_SNE_LABS.md) para entender como o SNE Radar se integra com:

- **SNE Vault** (`https://snelabs.space/`)
- **SNE Passport** (`https://pass.snelabs.space/`)

## 🚀 Início Rápido

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Instalação

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Configuração

1. Copie `.env.example` para `.env` e configure as variáveis de ambiente
2. Configure o banco de dados PostgreSQL
3. Configure o Redis para cache
4. Configure as variáveis de ambiente do GCP (se usando Cloud Run)

### Execução Local

```bash
# Backend
cd backend
flask run

# Frontend
cd frontend
npm run dev
```

## 📦 Deploy

Consulte o [`PLANO_DEPLOY_COMPLETO_SNE_RADAR.md`](./PLANO_DEPLOY_COMPLETO_SNE_RADAR.md) para instruções detalhadas de deploy em:

- **Vercel** (Frontend)
- **GCP Cloud Run** (Backend)
- **GCP Cloud SQL** (Database)
- **GCP Cloud Memorystore** (Redis)

## 🔒 Segurança

- ✅ SIWE (Sign-In with Ethereum) com replay protection
- ✅ EIP-1271 para smart contract wallets (Safe, AA)
- ✅ Rate limiting por IP e por wallet
- ✅ Cookies HttpOnly + Secure + SameSite
- ✅ Validação on-chain de licenças
- ✅ Logs estruturados e observabilidade completa

## 📄 Licença

Proprietário - SNE Labs

## 🔗 Links

- **SNE Vault:** https://snelabs.space/
- **SNE Passport:** https://pass.snelabs.space/
- **Repositório:** https://github.com/SNE-Labs/SNE-Radar

## 👥 Contribuindo

Este é um projeto privado da SNE Labs. Para contribuições, entre em contato com a equipe.

---

**Status:** 🚧 Em desenvolvimento - Fase de implementação do plano de deploy
