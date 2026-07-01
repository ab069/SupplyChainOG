# SupplyChainOG

> Oil & Gas Supply Chain Logistics Platform

SupplyChainOG is a comprehensive supply chain logistics platform for the oil and gas industry. Manage terminals, track tanker shipments, monitor inventory, and receive real-time logistics alerts.

## Quick Start

```bash
docker compose up -d
```

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features

- **Terminal Management** — Create and manage crude export, product import, storage, and multi-purpose terminals with capacity tracking
- **Tanker Tracking** — Track vessel shipments from origin to destination with real-time status updates
- **Inventory Monitoring** — Monitor current stock levels against storage capacity with utilization metrics
- **Capacity Utilization** — Visual utilization bars and percentage calculations for all terminals
- **Shipment Tracking** — Full lifecycle management (scheduled → loading → in_transit → arrived → delivered)
- **Real-time Alerts** — WebSocket-powered logistics alerts for stock issues, delays, capacity problems, and berth availability
- **JWT Authentication** — Secure user registration and login
- **Dark Theme** — Modern dark UI with indigo (#4f46e5) accent

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│  Frontend   │────▶│   Backend    │────▶│ Postgres │
│  React/TS   │     │  FastAPI     │     │          │
│  Nginx      │◀────│  Uvicorn     │◀────│ DB       │
└─────────────┘     └──────────────┘     └──────────┘
       │                    │
       └──── WebSocket ─────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/terminals/` | List/Create terminals |
| GET/PUT/DELETE | `/api/terminals/{id}` | Terminal CRUD |
| GET | `/api/terminals/stats` | Terminal statistics |
| GET/POST | `/api/shipments/` | List/Create shipments |
| PATCH | `/api/shipments/{id}/status` | Update shipment status |
| GET | `/api/shipments/stats` | Shipment statistics |
| GET | `/api/alerts/` | List alerts |
| PATCH | `/api/alerts/{id}/status` | Update alert status |
| GET | `/api/alerts/stats` | Alert statistics |
| WS | `/ws/logistics` | Real-time logistics feed |

## Tech Stack

- **Backend**: Python 3.12, FastAPI, SQLAlchemy (async), PostgreSQL, JWT
- **Frontend**: React 18, TypeScript, Vite, Zustand, Axios
- **Infrastructure**: Docker, Docker Compose, Nginx

## Project Structure

```
SupplyChainOG/
├── backend/
│   ├── app/
│   │   ├── agents/          # Logistics agent (utilization, risk, reports)
│   │   ├── api/             # Route handlers (auth, terminals, shipments, alerts, ws)
│   │   ├── core/            # Config, security, database, deps
│   │   ├── models/          # SQLAlchemy models (User, Terminal, Shipment, Alert)
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Route pages
│   │   ├── store/           # Zustand store
│   │   ├── lib/             # API client
│   │   └── types/           # TypeScript types
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## License

MIT
