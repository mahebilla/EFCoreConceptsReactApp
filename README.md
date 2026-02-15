# EF Core Concepts — Full-Stack Learning App

A full-stack application for learning **Entity Framework Core 8** concepts using the classic **Northwind** database. Includes three interchangeable frontends — **React**, **Angular**, and **Blazor** — all calling the same .NET 8 Web API.

Each EF Core concept has a dedicated API controller and matching frontend page with runnable demos and inline C# code snippets.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core 8 Web API, Entity Framework Core 8, SQL Server |
| Frontend (React) | React 19, TypeScript, Vite 7, React Router 7, Axios |
| Frontend (Angular) | Angular 19, TypeScript, Standalone Components, Signals |
| Frontend (Blazor) | Blazor WebAssembly .NET 8, Razor Components, CSS Isolation |

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) (for React and Angular frontends)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB or full Express)
- Northwind sample database (see setup below)

---

## Database Setup

### 1. Install SQL Server Express

Download and install **SQL Server Express** from Microsoft. The default instance name is `SQLEXPRESS`.

After installation, verify it's running:
```bash
# PowerShell — check SQL Server service
Get-Service -Name 'MSSQL$SQLEXPRESS'
```

### 2. Install the Northwind Database

The app uses the classic **Northwind** sample database. You need to create it on your SQL Server Express instance.

**Option A — Download and run the SQL script:**

1. Download the Northwind SQL script from Microsoft:
   - Search for "Northwind and pubs sample databases" on Microsoft's site
   - Or use the `instnwnd.sql` script from Microsoft's SQL Server samples GitHub repository

2. Open **SQL Server Management Studio (SSMS)** or **Azure Data Studio**

3. Connect to your SQL Server Express instance: `.\SQLEXPRESS`

4. Run the SQL script — it will create the `Northwind` database with all tables, views, and stored procedures

**Option B — Using sqlcmd (command line):**
```bash
sqlcmd -S .\SQLEXPRESS -i instnwnd.sql
```

### 3. Verify the Database

Connect to `.\SQLEXPRESS` and confirm the `Northwind` database exists with these key tables:
- `Products` (77 rows)
- `Categories` (8 rows)
- `Customers` (91 rows)
- `Orders` (830 rows)
- `Order Details` (2,155 rows)
- `Employees` (9 rows)
- `Suppliers` (29 rows)
- `Shippers` (3 rows)

And these stored procedures:
- `CustOrderHist`
- `Ten Most Expensive Products`

### Connection String

The API connects using Windows Authentication (no password needed):

```
Server=.\SQLEXPRESS;Database=Northwind;Trusted_Connection=True;TrustServerCertificate=True;
```

This is configured in `NorthwindApi/appsettings.json`. Update it if your SQL Server instance name differs.

---

## Running the Application

### Step 1: Start the API (always required)

```bash
cd NorthwindApi
dotnet run
```

The API starts at **http://localhost:5009**. Swagger UI is available at http://localhost:5009/swagger.

### Step 2: Start a Frontend (pick one)

#### Option A — React (port 5173)

```bash
cd northwind-client
npm install      # first time only
npm run dev
```

Open **http://localhost:5173**

#### Option B — Angular (port 4200)

```bash
cd northwind-angular
npm install      # first time only
npm start
```

Open **http://localhost:4200**

#### Option C — Blazor WebAssembly (port 5200)

```bash
cd northwind-blazor
dotnet run
```

Open **http://localhost:5200**

---

## EF Core Concepts Covered (12 total)

| # | Concept | API Route | What It Demonstrates |
|---|---------|-----------|---------------------|
| 1 | Basic Queries | `/api/basicqueries` | Where, Find, First, Count, Aggregates, GroupBy, Join, TagWith |
| 2 | Raw SQL | `/api/rawsql` | FromSql, FromSqlRaw, SqlQuery, ExecuteSql |
| 3 | Related Data | `/api/relateddata` | Include, ThenInclude, Explicit Loading, Lazy Loading |
| 4 | Tracking | `/api/tracking` | AsNoTracking, IdentityResolution, Performance Comparison |
| 5 | CRUD Operations | `/api/crudoperations` | Add, Update, Remove, Attach, SaveChanges |
| 6 | Bulk Operations | `/api/bulkoperations` | ExecuteUpdate, ExecuteDelete (EF Core 7+) |
| 7 | Transactions | `/api/transactions` | BeginTransaction, Commit, Rollback, Savepoints |
| 8 | Compiled Queries | `/api/compiledqueries` | EF.CompileQuery, CompileAsyncQuery |
| 9 | Global Filters | `/api/globalfilters` | HasQueryFilter, IgnoreQueryFilters |
| 10 | Change Tracker | `/api/changetracker` | Entries, EntityState, OriginalValues, DetectChanges |
| 11 | Stored Procedures | `/api/storedprocedures` | SqlQueryRaw with Northwind SPs |
| 12 | Pagination | `/api/pagination` | Skip/Take (Offset), Keyset (Cursor) Pagination |

---

## Project Structure

```
CluadeCoreReactEntityFramework/
├── NorthwindApi/           .NET 8 Web API (12 controllers)
├── northwind-client/       React 19 frontend (Vite)
├── northwind-angular/      Angular 19 frontend (CLI)
├── northwind-blazor/       Blazor WebAssembly frontend (.NET 8)
├── CLAUDE.md               Project context for Claude Code
├── FOLDER_STRUCTURE.md     Detailed file tree
└── README.md               This file
```

See [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) for the complete file tree.

---

## Learning Resources

The Angular and Blazor frontends are designed as **learning resources** — every source file has inline comments explaining framework concepts with React comparisons.

- **Angular guide**: [northwind-angular/ANGULAR_CONCEPTS.md](northwind-angular/ANGULAR_CONCEPTS.md) — 15 sections covering Angular concepts
- **Blazor guide**: [northwind-blazor/BLAZOR_CONCEPTS.md](northwind-blazor/BLAZOR_CONCEPTS.md) — 20 sections covering Blazor concepts

---

## Troubleshooting

### API won't start
- Ensure SQL Server Express is running: `Get-Service -Name 'MSSQL$SQLEXPRESS'`
- Check the connection string in `NorthwindApi/appsettings.json` matches your instance
- Make sure the Northwind database exists

### Frontend can't reach the API
- Verify the API is running on port 5009
- For React/Angular: the dev proxy forwards `/api` requests to the API
- For Blazor: CORS is configured for `http://localhost:5200` in the API

### Blazor first load is slow
- Normal — Blazor WASM downloads the .NET runtime (~2-5MB) on first load
- Subsequent loads use the browser cache and are much faster

### Port conflicts
| Service | Port | Config Location |
|---------|------|-----------------|
| API | 5009 | `NorthwindApi/Properties/launchSettings.json` |
| React | 5173 | `northwind-client/vite.config.ts` |
| Angular | 4200 | Angular CLI default |
| Blazor | 5200 | `northwind-blazor/Properties/launchSettings.json` |
