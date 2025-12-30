# SNE Radar - Deploy

Sistema de análise técnica e gráfica para criptomoedas, integrado ao ecossistema SNE Labs.

## 📋 Estrutura do Projeto

```
SNE-RADAR-DEPLOY/
├── frontend/          # Vue.js 3 + TypeScript + Vite
├── backend/           # Flask + Socket.IO
├── contracts/         # Smart contracts (ABI, etc)
└── docs/              # Documentação adicional
```

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+
- **Python** 3.11+
- **PostgreSQL** 14+ (ou Cloud SQL)
- **Redis** 7+ (ou Cloud Memorystore)

### Instalação

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

## 📚 Documentação

Consulte o arquivo `PLANO_DEPLOY_COMPLETO_SNE_RADAR.md` no repositório principal para:

- Arquitetura detalhada
- Guia de implementação passo a passo
- Configuração de infraestrutura (GCP + Vercel)
- Integração com smart contracts
- Sistema de monetização (Free, Premium, Pro)
- Hardening e segurança

## 🔗 Links

- **Repositório:** https://github.com/SNE-Labs/SNE-Radar
- **SNE Vault:** https://snelabs.space/
- **SNE Passport:** https://pass.snelabs.space/

---

**Status:** 🚧 Em desenvolvimento

