# Angular Concepts Used in This Project

> A complete guide for React developers learning Angular. Every Angular concept used in this project is documented below with its React equivalent.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Components](#2-components)
3. [Templates & Data Binding](#3-templates--data-binding)
4. [Control Flow](#4-control-flow-angular-19)
5. [Component Communication](#5-component-communication-inputoutput)
6. [Signals (Reactive State)](#6-signals-reactive-state---angular-19)
7. [Dependency Injection & Services](#7-dependency-injection--services)
8. [HttpClient & Observables](#8-httpclient--observables)
9. [Routing](#9-routing)
10. [Content Projection](#10-content-projection-ng-content)
11. [Pipes](#11-pipes)
12. [Style Encapsulation](#12-style-encapsulation)
13. [Angular CLI](#13-angular-cli)
14. [File Naming Conventions](#14-file-naming-conventions)
15. [Quick Reference Cheat Sheet](#15-quick-reference-cheat-sheet)

---

## 1. Project Structure

### Angular vs React Project Layout

| Concept | Angular | React |
|---------|---------|-------|
| Build tool | Angular CLI (`ng`) | Vite |
| Config file | `angular.json` | `vite.config.ts` |
| Entry point | `src/main.ts` | `src/main.tsx` |
| Root component | `src/app/app.component.ts` | `src/App.tsx` |
| Routing config | `src/app/app.routes.ts` | Inside `App.tsx` |
| Global styles | `src/styles.css` | `src/index.css` |
| Dev proxy | `proxy.conf.json` | `vite.config.ts` proxy |

### Angular Folder Convention

Each component gets its own folder:
```
src/app/
  components/
    data-table/
      data-table.component.ts    ← Component class + template + styles
    code-snippet/
      code-snippet.component.ts
    demo-section/
      demo-section.component.ts
  layout/
    main-layout/
      main-layout.component.ts
    sidebar/
      sidebar.component.ts
  pages/
    basic-queries/
      basic-queries.component.ts
  models/
    endpoint-demo.model.ts       ← Shared interfaces
  services/
    api.service.ts               ← HTTP service
```

**React equivalent**: Files are typically flat (`DataTable.tsx`, `CodeSnippet.tsx`).

**Where to see it**: Every component folder in the project.

---

## 2. Components

### Standalone Components (Angular 19 Default)

```typescript
// Angular
@Component({
  selector: 'app-data-table',     // HTML tag name
  standalone: true,                // No NgModule needed
  imports: [OtherComponent],       // Declare dependencies
  template: `<div>...</div>`,      // HTML template
  styles: [`...`],                 // Scoped CSS
})
export class DataTableComponent {
  // Component logic as class properties and methods
}
```

```tsx
// React equivalent
function DataTable({ data }: Props) {
  // Component logic as variables and functions
  return <div>...</div>;
}
export default DataTable;
```

**Key differences**:
- Angular uses **classes** with decorators; React uses **functions**
- Angular uses **HTML templates** (separate from logic); React uses **JSX** (logic + markup together)
- Angular requires declaring component dependencies in `imports[]`; React just `import` at the top

**Where to see it**: [data-table.component.ts](src/app/components/data-table/data-table.component.ts)

---

## 3. Templates & Data Binding

Angular templates use special syntax for binding data:

| Binding Type | Angular | React | Example |
|-------------|---------|-------|---------|
| Text interpolation | `{{ value }}` | `{ value }` | `{{ product.name }}` |
| Property binding | `[prop]="value"` | `prop={value}` | `[disabled]="isLoading"` |
| Event binding | `(event)="handler()"` | `onEvent={handler}` | `(click)="save()"` |
| Two-way binding | `[(ngModel)]="value"` | `value={val} onChange={...}` | `[(ngModel)]="name"` |
| Style binding | `[style.color]="'red'"` | `style={{ color: 'red' }}` | `[style.backgroundColor]="color"` |
| Class binding | `[class.active]="isActive"` | `className={isActive ? 'active' : ''}` | — |

**Where to see it**: [demo-section.component.ts](src/app/components/demo-section/demo-section.component.ts) — uses all binding types.

---

## 4. Control Flow (Angular 19)

Angular 19 introduced new built-in control flow syntax that replaces the older `*ngIf` and `*ngFor` directives:

### @if / @else
```html
<!-- Angular 19 -->
@if (data.length > 0) {
  <table>...</table>
} @else {
  <p>No data.</p>
}
```
```tsx
// React
{data.length > 0 ? <table>...</table> : <p>No data.</p>}
```

### @for (with track)
```html
<!-- Angular 19 -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```
```tsx
// React
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

**The `track` expression** is like React's `key` prop — it tells Angular how to identify each item for efficient DOM updates.

### @empty
```html
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found.</p>
}
```
React has no direct equivalent — you'd use a conditional check.

**Where to see it**: [data-table.component.ts](src/app/components/data-table/data-table.component.ts) — uses `@if`, `@for`, `@else`.

---

## 5. Component Communication (@Input/@Output)

### @Input() — Parent → Child (like React props)

```typescript
// Angular child component
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() title?: string;
}
```
```html
<!-- Angular parent template -->
<app-data-table [data]="myData" [title]="'Products'"></app-data-table>
```

```tsx
// React equivalent
function DataTable({ data, title }: { data: any[]; title?: string }) { ... }

// Usage:
<DataTable data={myData} title="Products" />
```

**Key difference**: Angular uses `[squareBrackets]` for dynamic binding. Without brackets, it's a plain string attribute.

**Where to see it**: All page components pass `[demos]`, `[title]`, `[subtitle]` to `<app-demo-section>`.

---

## 6. Signals (Reactive State) — Angular 19

Signals are Angular's answer to React's `useState`:

```typescript
// Angular
import { signal } from '@angular/core';

export class DemoSectionComponent {
  results = signal<Record<string, any>>({});   // Create signal
  loading = signal<Record<string, boolean>>({});

  runDemo() {
    // Read value — note the () call
    const current = this.results();

    // Update value
    this.results.set({ key: 'value' });

    // Update based on previous value (like React's functional setState)
    this.results.update(prev => ({ ...prev, newKey: 'newValue' }));
  }
}
```

```typescript
// React equivalent
const [results, setResults] = useState<Record<string, any>>({});
const [loading, setLoading] = useState<Record<string, boolean>>({});

const runDemo = () => {
  const current = results;  // Read directly (no call needed)
  setResults({ key: 'value' });
  setResults(prev => ({ ...prev, newKey: 'newValue' }));
};
```

**Key differences**:
| | Angular Signal | React useState |
|---|---|---|
| Create | `signal(initialValue)` | `useState(initialValue)` |
| Read | `this.results()` (call it!) | `results` (direct access) |
| Set | `this.results.set(value)` | `setResults(value)` |
| Update | `this.results.update(fn)` | `setResults(fn)` |
| In template | `{{ results() }}` | `{ results }` |

**Where to see it**: [demo-section.component.ts](src/app/components/demo-section/demo-section.component.ts)

---

## 7. Dependency Injection & Services

This is Angular's **biggest conceptual difference** from React.

### What is DI?
Instead of importing modules directly, Angular's DI system creates and provides instances:

```typescript
// Angular service
@Injectable({ providedIn: 'root' })  // Singleton — one instance app-wide
export class ApiService {
  constructor(private http: HttpClient) {}  // DI injects HttpClient
  // ... methods
}

// Angular component using the service
export class DemoSectionComponent {
  private apiService = inject(ApiService);  // DI provides the instance
}
```

```typescript
// React equivalent — no DI, just imports
import axios from 'axios';

function DemoSection() {
  // Use axios directly — no injection needed
  const response = await axios.get('/api/...');
}
```

### Why DI matters:
1. **Testing**: Swap real HttpClient with a mock in tests
2. **Singleton management**: Angular ensures only one ApiService instance exists
3. **Decoupling**: Components don't know how services are created

### Two ways to inject:
```typescript
// Modern way (Angular 14+): inject() function
private apiService = inject(ApiService);

// Classic way: constructor injection
constructor(private apiService: ApiService) {}
```

**Where to see it**: [api.service.ts](src/app/services/api.service.ts) and [demo-section.component.ts](src/app/components/demo-section/demo-section.component.ts)

---

## 8. HttpClient & Observables

### HttpClient (replaces axios)

```typescript
// Angular
this.http.get('/api/products')        // Returns Observable<any>
this.http.post('/api/products', body) // Returns Observable<any>
this.http.put('/api/products/1', body)
this.http.delete('/api/products/1')
```

```typescript
// React + axios
axios.get('/api/products')            // Returns Promise<AxiosResponse>
axios.post('/api/products', body)
```

### Observables vs Promises

```typescript
// Angular — Observable with subscribe()
this.http.get('/api/products').subscribe({
  next: (data) => console.log(data),     // Success
  error: (err) => console.error(err),    // Error
  complete: () => console.log('Done'),   // Completed
});
```

```typescript
// React — Promise with .then()/.catch()
axios.get('/api/products')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// Or with async/await:
const res = await axios.get('/api/products');
```

### Key differences:
| | Observable (Angular) | Promise (React) |
|---|---|---|
| Values | Can emit multiple values | Resolves once |
| Cancellable | Yes (unsubscribe) | No |
| Operators | map, filter, retry, debounce... | Limited chaining |
| Lazy | Doesn't execute until subscribed | Executes immediately |

**Where to see it**: [api.service.ts](src/app/services/api.service.ts) and [demo-section.component.ts](src/app/components/demo-section/demo-section.component.ts)

---

## 9. Routing

### Route Configuration

```typescript
// Angular — app.routes.ts (plain array)
export const routes: Routes = [
  { path: '', redirectTo: '/basic-queries', pathMatch: 'full' },
  {
    path: 'basic-queries',
    loadComponent: () => import('./pages/basic-queries/basic-queries.component')
      .then(m => m.BasicQueriesComponent),
  },
];
```

```tsx
// React — App.tsx (JSX components)
<Routes>
  <Route path="/" element={<Navigate to="/basic-queries" replace />} />
  <Route path="/basic-queries" element={<BasicQueries />} />
</Routes>
```

### Navigation Links

```html
<!-- Angular -->
<a [routerLink]="'/basic-queries'"
   routerLinkActive="active">
  Basic Queries
</a>
```

```tsx
// React
<NavLink to="/basic-queries"
  style={({ isActive }) => ({ color: isActive ? 'white' : 'gray' })}>
  Basic Queries
</NavLink>
```

### Lazy Loading (Code Splitting)

Angular uses `loadComponent` for per-route code splitting:
```typescript
// Angular — component code downloaded only when route is visited
loadComponent: () => import('./pages/basic-queries/basic-queries.component')
  .then(m => m.BasicQueriesComponent)
```

```tsx
// React equivalent
const BasicQueries = React.lazy(() => import('./pages/BasicQueries'));
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/basic-queries" element={<BasicQueries />} />
</Suspense>
```

### RouterOutlet (where routes render)

```html
<!-- Angular — in app.component.ts template -->
<router-outlet />
```

```tsx
// React — Routes renders matched route automatically
<Routes>
  <Route path="..." element={...} />
</Routes>
```

**Where to see it**: [app.routes.ts](src/app/app.routes.ts), [sidebar.component.ts](src/app/layout/sidebar/sidebar.component.ts)

---

## 10. Content Projection (<ng-content>)

Angular's equivalent of React's `{children}`:

```html
<!-- Angular: main-layout.component.ts -->
<div style="display: flex;">
  <app-sidebar></app-sidebar>
  <main>
    <ng-content></ng-content>   <!-- Child content appears here -->
  </main>
</div>

<!-- Usage: -->
<app-main-layout>
  <router-outlet />             <!-- This goes into <ng-content> -->
</app-main-layout>
```

```tsx
// React equivalent
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// Usage:
<MainLayout>
  <Routes>...</Routes>
</MainLayout>
```

**Where to see it**: [main-layout.component.ts](src/app/layout/main-layout/main-layout.component.ts)

---

## 11. Pipes

Pipes transform data in templates (like inline functions in JSX):

```html
<!-- Angular -->
{{ data | json }}                    <!-- Pretty-print object as JSON -->
{{ name | uppercase }}               <!-- Convert to uppercase -->
{{ price | currency:'USD' }}         <!-- Format as $1,234.56 -->
{{ date | date:'short' }}            <!-- Format date -->
```

```tsx
// React equivalents
{JSON.stringify(data, null, 2)}
{name.toUpperCase()}
{price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
{new Date(date).toLocaleDateString()}
```

**Where to see it**: [demo-section.component.ts](src/app/components/demo-section/demo-section.component.ts) uses the `json` pipe.

---

## 12. Style Encapsulation

Angular automatically scopes CSS to each component:

```typescript
@Component({
  styles: [`
    .nav-link { color: #aaa; }
    .nav-link.active { color: #fff; }
  `]
})
```

These styles **only affect this component** — they won't leak to other components. Angular achieves this by adding unique attributes to elements (e.g., `_ngcontent-abc123`).

**React**: Uses inline styles, CSS modules, or styled-components for scoping.

**Where to see it**: [sidebar.component.ts](src/app/layout/sidebar/sidebar.component.ts) uses component-scoped styles.

---

## 13. Angular CLI

The Angular CLI (`ng`) is the primary development tool:

| Command | Purpose | React/Vite Equivalent |
|---------|---------|----------------------|
| `ng new my-app` | Create new project | `npm create vite@latest` |
| `ng serve` | Dev server with hot reload | `npm run dev` (Vite) |
| `ng build` | Production build | `npm run build` |
| `ng generate component foo` | Generate component files | Manual file creation |
| `ng test` | Run unit tests | `npm test` |

**Proxy config**: `ng serve --proxy-config proxy.conf.json` (like Vite's proxy).

---

## 14. File Naming Conventions

| Type | Angular Convention | React Convention |
|------|-------------------|-----------------|
| Component | `data-table.component.ts` | `DataTable.tsx` |
| Service | `api.service.ts` | `useApi.ts` or `api.ts` |
| Model | `endpoint-demo.model.ts` | `types.ts` or inline |
| Test | `*.spec.ts` | `*.test.ts` |
| Module | `feature.module.ts` | N/A |

Angular uses **kebab-case** for filenames with type suffixes. React uses **PascalCase**.

---

## 15. Quick Reference Cheat Sheet

| React | Angular | Where in this project |
|-------|---------|----------------------|
| `useState()` | `signal()` | demo-section.component.ts |
| `{children}` | `<ng-content>` | main-layout.component.ts |
| `props` | `@Input()` | data-table.component.ts |
| `onClick={}` | `(click)=""` | demo-section.component.ts |
| `{condition && <div>}` | `@if (condition) { <div> }` | data-table.component.ts |
| `array.map()` | `@for (item of array)` | data-table.component.ts |
| `key={id}` | `track id` | sidebar.component.ts |
| `<NavLink>` | `routerLink` + `routerLinkActive` | sidebar.component.ts |
| `<Routes>` | `<router-outlet />` | app.component.ts |
| `React.lazy()` | `loadComponent` | app.routes.ts |
| `axios` | `HttpClient` | api.service.ts |
| `.then()` | `.subscribe()` | demo-section.component.ts |
| `import module` | `inject(Service)` | demo-section.component.ts |
| CSS modules | Component `styles[]` | sidebar.component.ts |
| `JSON.stringify()` | `\| json` pipe | demo-section.component.ts |
