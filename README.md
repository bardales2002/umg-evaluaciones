# Evaluación Anónima de Catedráticos – UMG

Backend: Node.js + Express + MySQL (mysql2)  
DB prod: Railway  
Hosting (API + estático): Render

**Demo:** https://umg-evaluaciones.onrender.com/

## Requisitos
- Node 18+ (dev)
- MySQL 8+ (local) o Railway

## Variables (.env)
### Local
PORT=3000  
DB_HOST=localhost  
DB_PORT=3306  
DB_USER=root  
DB_PASSWORD=TU_PASS  
DB_NAME=evaluacion_catedraticos

### Producción (Railway – usar PUBLIC URL)
PORT=3000  
DB_HOST=centerbeam.proxy.rlwy.net  
DB_PORT=22985  
DB_USER=root  
DB_PASSWORD=TU_PASS_DE_RAILWAY  
DB_NAME=railway

## Instalar y correr local
```bash
npm install
npm run db:init   # schema + seed (opcional en local)
npm run dev       # http://localhost:3000
