# Project Folder Structure

## Overview

This is a full-stack application for learning **Entity Framework Core** concepts, built with an **ASP.NET Core 8 Web API** backend and **three interchangeable frontends** — **React 19**, **Angular 19**, and **Blazor WebAssembly (.NET 8)**. It uses the classic **Northwind** database to demonstrate various EF Core features. All three frontends run independently against the same API.

```
CluadeCoreReactEntityFramework/
│
├── NorthwindApi.sln                  # .NET Solution file
│
├── NorthwindApi/                     # ASP.NET Core 8 Web API (Backend)
│   ├── Program.cs                    # Application entry point & middleware config
│   ├── NorthwindApi.csproj           # Project file (dependencies, build config)
│   ├── appsettings.json              # App configuration (connection strings, etc.)
│   ├── appsettings.Development.json  # Dev-specific configuration
│   ├── NorthwindApi.http             # HTTP request file for testing API endpoints
│   │
│   ├── Models/                       # EF Core Entity models (mapped to Northwind DB)
│   │   ├── Category.cs
│   │   ├── Customer.cs
│   │   ├── Employee.cs
│   │   ├── Order.cs
│   │   ├── OrderDetail.cs
│   │   ├── Product.cs
│   │   ├── Supplier.cs
│   │   ├── Shipper.cs
│   │   ├── Region.cs
│   │   ├── Territory.cs
│   │   ├── CustomerDemographic.cs
│   │   ├── Invoice.cs
│   │   ├── QuarterlyOrder.cs
│   │   ├── AlphabeticalListOfProduct.cs    # View model
│   │   ├── CategorySalesFor1997.cs         # View model
│   │   ├── CurrentProductList.cs           # View model
│   │   ├── CustomerAndSuppliersByCity.cs   # View model
│   │   ├── OrderDetailsExtended.cs         # View model
│   │   ├── OrdersQry.cs                    # View model
│   │   ├── OrderSubtotal.cs                # View model
│   │   ├── ProductSalesFor1997.cs          # View model
│   │   ├── ProductsAboveAveragePrice.cs    # View model
│   │   ├── ProductsByCategory.cs           # View model
│   │   ├── SalesByCategory.cs              # View model
│   │   ├── SalesTotalsByAmount.cs          # View model
│   │   ├── SummaryOfSalesByQuarter.cs      # View model
│   │   └── SummaryOfSalesByYear.cs         # View model
│   │
│   ├── Data/                         # EF Core DbContext classes
│   │   ├── NorthwindContext.cs       # Primary DbContext (standard tracking)
│   │   └── NorthwindLazyContext.cs   # DbContext with lazy loading proxies
│   │
│   ├── DTOs/                         # Data Transfer Objects
│   │   └── StoredProcedureResults.cs # DTOs for stored procedure return types
│   │
│   ├── Controllers/                  # API Controllers (each demos an EF Core concept)
│   │   ├── BasicQueriesController.cs       # LINQ queries, filtering, projections
│   │   ├── CrudOperationsController.cs     # Create, Read, Update, Delete
│   │   ├── RelatedDataController.cs        # Eager/Explicit/Lazy loading
│   │   ├── TrackingController.cs           # Change tracking vs no-tracking queries
│   │   ├── BulkOperationsController.cs     # Bulk insert/update/delete
│   │   ├── TransactionsController.cs       # Database transactions
│   │   ├── RawSqlController.cs             # Raw SQL & interpolated queries
│   │   ├── CompiledQueriesController.cs    # Pre-compiled queries for performance
│   │   ├── GlobalFiltersController.cs      # Query filters applied globally
│   │   ├── ChangeTrackerController.cs      # ChangeTracker API usage
│   │   ├── StoredProceduresController.cs   # Calling stored procedures via EF Core
│   │   └── PaginationController.cs         # Skip/Take pagination patterns
│   │
│   ├── Properties/
│   │   └── launchSettings.json       # Dev launch profiles (ports, URLs)
│   │
│   ├── bin/                          # Build output (git-ignored)
│   └── obj/                          # Build intermediates (git-ignored)
│
├── northwind-client/                 # React 19 + TypeScript Frontend (Vite)
│   ├── package.json                  # NPM dependencies & scripts
│   ├── package-lock.json             # Locked dependency versions
│   ├── vite.config.ts                # Vite build configuration
│   ├── tsconfig.json                 # Root TypeScript config
│   ├── tsconfig.app.json             # App-specific TS config
│   ├── tsconfig.node.json            # Node/Vite TS config
│   ├── eslint.config.js              # ESLint configuration
│   ├── index.html                    # SPA entry point
│   │
│   └── src/                          # Application source code
│       ├── main.tsx                  # React entry point (renders App)
│       ├── App.tsx                   # Root component with routing
│       ├── index.css                 # Global styles
│       │
│       ├── assets/
│       │   └── react.svg             # React logo asset
│       │
│       ├── layout/                   # Layout components
│       │   ├── MainLayout.tsx        # Page shell (sidebar + content area)
│       │   └── Sidebar.tsx           # Navigation sidebar
│       │
│       ├── components/               # Reusable UI components
│       │   ├── DataTable.tsx         # Generic data table for API results
│       │   ├── CodeSnippet.tsx       # Code block display (shows C# snippets)
│       │   └── DemoSection.tsx       # Wrapper for demo sections
│       │
│       └── pages/                    # Page components (one per EF Core concept)
│           ├── BasicQueries.tsx
│           ├── CrudOperations.tsx
│           ├── RelatedData.tsx
│           ├── Tracking.tsx
│           ├── BulkOperations.tsx
│           ├── Transactions.tsx
│           ├── RawSql.tsx
│           ├── CompiledQueries.tsx
│           ├── GlobalFilters.tsx
│           ├── ChangeTracker.tsx
│           ├── StoredProcedures.tsx
│           └── Pagination.tsx
│
├── northwind-angular/                # Angular 19 + TypeScript Frontend (CLI)
│   ├── package.json                  # NPM dependencies & scripts
│   ├── angular.json                  # Angular CLI build config
│   ├── proxy.conf.json               # Dev proxy: /api → localhost:5009
│   ├── tsconfig.json                 # Root TypeScript config
│   ├── tsconfig.app.json             # App-specific TS config
│   ├── ANGULAR_CONCEPTS.md           # Angular learning guide (React comparisons)
│   │
│   └── src/
│       ├── main.ts                   # Angular entry point (bootstraps app)
│       ├── index.html                # SPA entry point (<app-root>)
│       ├── styles.css                # Global styles
│       │
│       └── app/
│           ├── app.component.ts      # Root component (layout + router-outlet)
│           ├── app.config.ts         # Providers (HttpClient, Router, Zone)
│           ├── app.routes.ts         # 12 lazy-loaded routes
│           │
│           ├── models/
│           │   └── endpoint-demo.model.ts  # Shared EndpointDemo interface
│           │
│           ├── services/
│           │   └── api.service.ts    # HttpClient wrapper (replaces axios)
│           │
│           ├── layout/               # Layout components
│           │   ├── main-layout/      # Shell: sidebar + <ng-content>
│           │   └── sidebar/          # Navigation with routerLink
│           │
│           ├── components/           # Reusable UI components
│           │   ├── data-table/       # Generic data table
│           │   ├── code-snippet/     # C# code block display
│           │   └── demo-section/     # Core demo runner (signals + HttpClient)
│           │
│           └── pages/                # Page components (one per EF Core concept)
│               ├── basic-queries/
│               ├── raw-sql/
│               ├── related-data/
│               ├── tracking/
│               ├── crud-operations/
│               ├── bulk-operations/
│               ├── transactions/
│               ├── compiled-queries/
│               ├── global-filters/
│               ├── change-tracker/
│               ├── stored-procedures/
│               └── pagination/
│
├── northwind-blazor/                 # Blazor WebAssembly .NET 8 (port 5200)
│   ├── NorthwindBlazor.csproj       # .NET project file
│   ├── Program.cs                   # Entry point, HttpClient DI, ApiService registration
│   ├── App.razor                    # Router component (auto-discovers @page routes)
│   ├── _Imports.razor               # Global @using directives
│   ├── BLAZOR_CONCEPTS.md           # Blazor learning guide (React comparisons)
│   │
│   ├── Models/
│   │   └── EndpointDemo.cs          # C# record (same shape as TS interface)
│   │
│   ├── Services/
│   │   └── ApiService.cs            # HttpClient wrapper returning JsonElement
│   │
│   ├── Layout/                      # Layout components (CSS isolation)
│   │   ├── MainLayout.razor         # Sidebar + @Body (like React {children})
│   │   ├── MainLayout.razor.css     # Scoped styles for layout
│   │   ├── NavMenu.razor            # Dark sidebar nav with NavLink
│   │   └── NavMenu.razor.css        # Scoped styles for nav
│   │
│   ├── Shared/                      # Reusable components (CSS isolation)
│   │   ├── DemoSection.razor        # Core demo runner (state, API calls, results)
│   │   ├── DemoSection.razor.css    # Scoped styles for demo section
│   │   ├── DataTable.razor          # Generic table from JsonElement arrays
│   │   ├── DataTable.razor.css      # Scoped styles for data table
│   │   ├── CodeSnippet.razor        # Dark-theme code block
│   │   └── CodeSnippet.razor.css    # Scoped styles for code block
│   │
│   ├── Pages/                       # Page components (one per EF Core concept)
│   │   ├── Home.razor               # Redirects / → /basic-queries
│   │   ├── BasicQueries.razor
│   │   ├── RawSql.razor
│   │   ├── RelatedData.razor
│   │   ├── Tracking.razor
│   │   ├── CrudOperations.razor
│   │   ├── BulkOperations.razor
│   │   ├── Transactions.razor
│   │   ├── CompiledQueries.razor
│   │   ├── GlobalFilters.razor
│   │   ├── ChangeTracker.razor
│   │   ├── StoredProcedures.razor
│   │   └── Pagination.razor
│   │
│   ├── Properties/
│   │   └── launchSettings.json      # Dev launch profile (port 5200)
│   │
│   └── wwwroot/                     # Static files (served by Blazor WASM)
│       ├── index.html               # SPA entry point (loads WASM runtime)
│       ├── css/app.css              # Global styles
│       └── favicon.png
```

## Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Backend            | ASP.NET Core 8, Entity Framework Core 8, SQL Server |
| Frontend (React)   | React 19, TypeScript 5.9, Vite 7, React Router 7, Axios |
| Frontend (Angular) | Angular 19, TypeScript 5.7, Standalone Components, Signals, HttpClient |
| Frontend (Blazor)  | Blazor WebAssembly .NET 8, Razor Components, CSS Isolation, HttpClient |
| API Docs           | Swagger / Swashbuckle               |

## Key Packages

### Backend (`NorthwindApi.csproj`)
- `Microsoft.EntityFrameworkCore.SqlServer` - SQL Server provider
- `Microsoft.EntityFrameworkCore.Proxies` - Lazy loading support
- `Microsoft.EntityFrameworkCore.Design` - Scaffolding/migrations tooling
- `Swashbuckle.AspNetCore` - Swagger UI
- `Microsoft.AspNetCore.SpaServices.Extensions` - SPA integration

### React Frontend (`northwind-client/package.json`)
- `react` / `react-dom` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls

### Angular Frontend (`northwind-angular/package.json`)
- `@angular/core` - Component framework
- `@angular/router` - Client-side routing
- `@angular/common/http` - Built-in HttpClient (no axios needed)
- `rxjs` - Reactive extensions (Observables)

### Blazor Frontend (`northwind-blazor/NorthwindBlazor.csproj`)
- `Microsoft.AspNetCore.Components.WebAssembly` - Blazor WASM runtime
- `Microsoft.AspNetCore.Components.WebAssembly.DevServer` - Dev server
- `System.Net.Http.Json` - JSON extensions for HttpClient

## How It Works

Each **EF Core concept** has a matching set:
- A **Controller** on the API side (e.g., `BasicQueriesController.cs`) exposing endpoints
- A **React Page** (e.g., `BasicQueries.tsx`), **Angular Page** (e.g., `basic-queries.component.ts`), OR **Blazor Page** (e.g., `BasicQueries.razor`)

All three frontends use the exact same API endpoints and demo data. Pick any one:
- **React** dev server: `http://localhost:5173` (Vite proxy to API)
- **Angular** dev server: `http://localhost:4200` (proxy.conf.json to API)
- **Blazor** dev server: `http://localhost:5200` (direct HTTP + CORS)
- **API**: `http://localhost:5009`

The Angular and Blazor projects also serve as **learning resources** — every source file has detailed comments explaining framework concepts with React equivalents.
- Angular guide: `northwind-angular/ANGULAR_CONCEPTS.md`
- Blazor guide: `northwind-blazor/BLAZOR_CONCEPTS.md`
