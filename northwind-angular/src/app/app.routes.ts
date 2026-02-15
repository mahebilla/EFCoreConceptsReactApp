/**
 * ROUTING — Angular Concept: Routes Configuration with Lazy Loading
 *
 * React equivalent: App.tsx with <Routes> and <Route> components.
 *
 * Key differences from React Router:
 *
 * 1. Routes are defined as a plain array of objects (not JSX components)
 * 2. loadComponent — Lazy loads components on demand (code splitting)
 *    React equivalent: React.lazy(() => import('./pages/BasicQueries'))
 * 3. redirectTo — Built-in redirect (React uses <Navigate to="..." />)
 * 4. pathMatch: 'full' — Only redirect when the FULL path matches ''
 *
 * Lazy Loading explained:
 * - loadComponent uses dynamic import() — the page code is only downloaded
 *   when the user navigates to that route (not on initial page load)
 * - This creates separate "chunks" in the build output
 * - React achieves the same with React.lazy() + Suspense
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route — redirect to /basic-queries
  // React equivalent: <Route path="/" element={<Navigate to="/basic-queries" replace />} />
  { path: '', redirectTo: '/basic-queries', pathMatch: 'full' },

  // Each route lazy-loads its component — only downloaded when navigated to
  // React equivalent: <Route path="/basic-queries" element={<BasicQueries />} />
  {
    path: 'basic-queries',
    loadComponent: () => import('./pages/basic-queries/basic-queries.component')
      .then(m => m.BasicQueriesComponent),
  },
  {
    path: 'raw-sql',
    loadComponent: () => import('./pages/raw-sql/raw-sql.component')
      .then(m => m.RawSqlComponent),
  },
  {
    path: 'related-data',
    loadComponent: () => import('./pages/related-data/related-data.component')
      .then(m => m.RelatedDataComponent),
  },
  {
    path: 'tracking',
    loadComponent: () => import('./pages/tracking/tracking.component')
      .then(m => m.TrackingComponent),
  },
  {
    path: 'crud-operations',
    loadComponent: () => import('./pages/crud-operations/crud-operations.component')
      .then(m => m.CrudOperationsComponent),
  },
  {
    path: 'bulk-operations',
    loadComponent: () => import('./pages/bulk-operations/bulk-operations.component')
      .then(m => m.BulkOperationsComponent),
  },
  {
    path: 'transactions',
    loadComponent: () => import('./pages/transactions/transactions.component')
      .then(m => m.TransactionsComponent),
  },
  {
    path: 'compiled-queries',
    loadComponent: () => import('./pages/compiled-queries/compiled-queries.component')
      .then(m => m.CompiledQueriesComponent),
  },
  {
    path: 'global-filters',
    loadComponent: () => import('./pages/global-filters/global-filters.component')
      .then(m => m.GlobalFiltersComponent),
  },
  {
    path: 'change-tracker',
    loadComponent: () => import('./pages/change-tracker/change-tracker.component')
      .then(m => m.ChangeTrackerComponent),
  },
  {
    path: 'stored-procedures',
    loadComponent: () => import('./pages/stored-procedures/stored-procedures.component')
      .then(m => m.StoredProceduresComponent),
  },
  {
    path: 'pagination',
    loadComponent: () => import('./pages/pagination/pagination.component')
      .then(m => m.PaginationComponent),
  },
];
