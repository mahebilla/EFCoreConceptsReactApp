# Blazor WebAssembly Concepts — A Guide for React Developers

This guide explains every Blazor concept used in the `northwind-blazor` project, with React comparisons for each.

---

## Table of Contents

1. [What is Blazor WebAssembly?](#1-what-is-blazor-webassembly)
2. [Razor Components (.razor files)](#2-razor-components-razor-files)
3. [@code Blocks](#3-code-blocks)
4. [[Parameter] — Component Props](#4-parameter--component-props)
5. [@bind — Two-Way Data Binding](#5-bind--two-way-data-binding)
6. [@onclick — Event Handling](#6-onclick--event-handling)
7. [@if / @else — Conditional Rendering](#7-if--else--conditional-rendering)
8. [@foreach — List Rendering](#8-foreach--list-rendering)
9. [@inject — Dependency Injection](#9-inject--dependency-injection)
10. [HttpClient + async/await](#10-httpclient--asyncawait)
11. [Lifecycle Methods](#11-lifecycle-methods)
12. [CSS Isolation (.razor.css)](#12-css-isolation-razorcss)
13. [@page — Routing Directive](#13-page--routing-directive)
14. [NavLink Component](#14-navlink-component)
15. [LayoutComponentBase + @Body](#15-layoutcomponentbase--body)
16. [RenderFragment](#16-renderfragment)
17. [StateHasChanged()](#17-statehaschanged)
18. [NavigationManager](#18-navigationmanager)
19. [Project Structure Comparison](#19-project-structure-comparison)
20. [Quick Reference Cheat Sheet](#20-quick-reference-cheat-sheet)

---

## 1. What is Blazor WebAssembly?

Blazor WebAssembly (WASM) runs **C# directly in the browser** via WebAssembly. No JavaScript needed for app logic.

| Aspect | React | Blazor WASM |
|--------|-------|-------------|
| Language | JavaScript/TypeScript | C# |
| Runs in | Browser (JS engine) | Browser (WebAssembly) |
| Bundle | JS bundle (~200KB) | .NET runtime + DLLs (~2-5MB first load) |
| Rendering | Virtual DOM diffing | DOM diffing via RenderTree |
| State | useState, useReducer | C# fields + StateHasChanged() |
| HTTP | axios/fetch | HttpClient |

**Key insight:** Blazor WASM is a **client-side SPA** just like React — it runs entirely in the browser and calls APIs via HTTP. The difference is the language (C# instead of JS).

```
React:   Browser → JS Engine → React Virtual DOM → DOM
Blazor:  Browser → WebAssembly → .NET Runtime → C# → RenderTree → DOM
```

---

## 2. Razor Components (.razor files)

Every `.razor` file is a **component** — Blazor's equivalent of a React function component.

**React:**
```tsx
// BasicQueries.tsx
function BasicQueries() {
  return <div>Hello</div>;
}
export default BasicQueries;
```

**Blazor:**
```razor
@* BasicQueries.razor *@
<div>Hello</div>
```

Key differences:
- No `export`, no `import` — Blazor discovers components by namespace (set in `_Imports.razor`)
- HTML markup goes directly in the file — no `return` statement needed
- Razor syntax uses `@` to switch between HTML and C#
- File name = component name (e.g., `DemoSection.razor` → `<DemoSection />`)

**Where in code:** Every `.razor` file in the project

---

## 3. @code Blocks

The `@code { }` block contains C# code (fields, methods, properties) — like the function body of a React component.

**React:**
```tsx
function DemoSection({ title }) {
  const [loading, setLoading] = useState(false);  // state
  const runDemo = async () => { ... };             // method
  return <div>{title}</div>;                       // markup is returned
}
```

**Blazor:**
```razor
@* Markup is at the top *@
<div>@Title</div>

@code {
    [Parameter] public string Title { get; set; }  // props
    private bool loading = false;                    // state
    private async Task RunDemo() { ... }            // method
}
```

Key differences:
- Markup is **above** the code block (not inside a return)
- State is just regular C# fields (no `useState` wrapper)
- Methods are regular C# methods (no hooks rules to follow)

**Where in code:** Every component with logic — `DemoSection.razor`, `NavMenu.razor`, page components

---

## 4. [Parameter] — Component Props

`[Parameter]` attribute marks a property as settable from a parent component — exactly like React props.

**React:**
```tsx
interface Props { title: string; subtitle: string; }
function DemoSection({ title, subtitle }: Props) {
  return <h1>{title}</h1>;
}
// Usage: <DemoSection title="Hello" subtitle="World" />
```

**Blazor:**
```razor
<h1>@Title</h1>

@code {
    [Parameter] public string Title { get; set; } = "";
    [Parameter] public string Subtitle { get; set; } = "";
}
@* Usage: <DemoSection Title="Hello" Subtitle="World" /> *@
```

Key differences:
- `[Parameter]` attribute instead of interface/destructuring
- Properties must be `public` with `{ get; set; }`
- PascalCase by convention (Title not title)
- No spread operator — each parameter is explicit

**Where in code:** `Shared/CodeSnippet.razor`, `Shared/DataTable.razor`, `Shared/DemoSection.razor`

---

## 5. @bind — Two-Way Data Binding

Blazor's `@bind` creates **two-way binding** between a C# field and an HTML element — React has no direct equivalent.

**React (one-way + onChange):**
```tsx
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
```

**Blazor (two-way):**
```razor
<input @bind="name" />
@* Or with explicit event: *@
<input @bind="name" @bind:event="oninput" />

@code {
    private string name = "";
}
```

Key differences:
- `@bind` = value + onChange combined in one directive
- Default event is `onchange` (fires on blur); use `@bind:event="oninput"` for real-time
- More like Angular's `[(ngModel)]` than React's controlled inputs

**Where in code:** Not used in this project (read-only demo app), but documented here for learning

---

## 6. @onclick — Event Handling

Blazor uses `@onclick` to bind C# methods to DOM events — like React's `onClick`.

**React:**
```tsx
<button onClick={() => runDemo(demo)}>Run</button>
<button onClick={handleClick}>Click</button>
```

**Blazor:**
```razor
<button @onclick="() => RunDemo(demo)">Run</button>
<button @onclick="HandleClick">Click</button>
```

Key differences:
- `@onclick` instead of `onClick` (lowercase "c", with @ prefix)
- Lambda syntax is nearly identical: `() => Method(arg)`
- Can be `async`: `@onclick="async () => await RunDemo(demo)"`
- Other events: `@onchange`, `@oninput`, `@onmouseover`, `@onkeydown`, etc.

**Where in code:** `Shared/DemoSection.razor` (Run button for each demo)

---

## 7. @if / @else — Conditional Rendering

**React:**
```tsx
{isLoading ? <span>Loading...</span> : <span>Ready</span>}
{result && <div>{result}</div>}
```

**Blazor:**
```razor
@if (isLoading)
{
    <span>Loading...</span>
}
else
{
    <span>Ready</span>
}

@if (result != null)
{
    <div>@result</div>
}
```

Key differences:
- Full C# `if/else` syntax (not ternary expressions)
- Curly braces `{ }` are required
- More readable for complex conditions
- Also supports `@switch` for multiple cases

**Where in code:** `Shared/DemoSection.razor` (loading state, error display, result rendering)

---

## 8. @foreach — List Rendering

**React:**
```tsx
{demos.map(demo => (
  <div key={demo.name}>{demo.name}</div>
))}
```

**Blazor:**
```razor
@foreach (var demo in Demos)
{
    <div>@demo.Name</div>
}
```

Key differences:
- No `key` prop needed — Blazor tracks by reference (though `@key` is available)
- Full C# `foreach` loop — not a functional `.map()` call
- Can use `for`, `while`, and other C# loops too
- Variables are scoped to the loop body

**Where in code:** `Layout/NavMenu.razor` (nav items), `Shared/DemoSection.razor` (demos), `Shared/DataTable.razor` (rows/columns)

---

## 9. @inject — Dependency Injection

Blazor uses **dependency injection** to provide services — like Angular's `inject()`, unlike React's direct imports.

**React (no DI):**
```tsx
import axios from 'axios';  // Direct import
const res = await axios.get('/api/...');
```

**Blazor:**
```razor
@inject ApiService Api
@* Or in @code block: *@
@code {
    [Inject] private ApiService Api { get; set; } = default!;
}
```

Services must be registered in `Program.cs`:
```csharp
builder.Services.AddScoped<ApiService>();
```

Key differences:
- Services are **registered** centrally (like Angular's `providedIn: 'root'`)
- `@inject` in the markup or `[Inject]` attribute in `@code`
- Enables testability — swap real services for mocks in tests
- React just imports modules directly; Blazor uses the DI container

**Where in code:** `Shared/DemoSection.razor` (@inject ApiService), `Pages/Home.razor` (@inject NavigationManager)

---

## 10. HttpClient + async/await

Blazor uses `HttpClient` with `async/await` — **very similar** to React's axios + async/await.

**React:**
```tsx
const response = await axios.get('/api/products');
const data = response.data;
```

**Blazor:**
```csharp
var response = await _http.GetAsync("/api/products");
var json = await response.Content.ReadAsStringAsync();
var data = JsonSerializer.Deserialize<JsonElement>(json);
```

Key differences:
- `HttpClient` is .NET's built-in HTTP client (like axios but from the framework)
- `Task<T>` instead of `Promise<T>` — but `async/await` works the same way!
- No Observables (unlike Angular) — Blazor's pattern is closer to React
- JSON deserialization is explicit (C# is strongly typed)

**Where in code:** `Services/ApiService.cs`

---

## 11. Lifecycle Methods

Blazor has lifecycle methods — like React's `useEffect` or class component lifecycle methods.

| Blazor | React Equivalent | When |
|--------|-----------------|------|
| `OnInitialized()` | First `useEffect(fn, [])` | Component first created |
| `OnInitializedAsync()` | `useEffect(async () => {...}, [])` | Async version |
| `OnParametersSet()` | `useEffect(fn, [props])` | After params change |
| `OnAfterRender(firstRender)` | `useEffect(fn)` (every render) | After DOM update |
| `Dispose()` | Return from `useEffect` (cleanup) | Component removed |

**React:**
```tsx
useEffect(() => {
  fetchData();
  return () => cleanup();
}, []);
```

**Blazor:**
```csharp
protected override async Task OnInitializedAsync()
{
    await FetchData();
}

public void Dispose()
{
    Cleanup();
}
```

Key differences:
- Named methods instead of hooks — no rules about ordering
- Can be `async` natively (no workarounds needed)
- `OnInitializedAsync` runs during server-side prerendering AND client-side
- No dependency array — methods run at well-defined lifecycle points

**Where in code:** `Pages/Home.razor` (OnInitialized for redirect)

---

## 12. CSS Isolation (.razor.css)

Blazor's CSS isolation scopes styles to a single component — like React CSS Modules.

**React (CSS Modules):**
```tsx
import styles from './Button.module.css';
<button className={styles.primary}>Click</button>
```

**Blazor (CSS Isolation):**
```css
/* Button.razor.css — automatically scoped to Button.razor */
.primary { background: blue; }
```
```razor
<!-- Button.razor — just use the class name normally -->
<button class="primary">Click</button>
```

How it works:
1. Create `ComponentName.razor.css` alongside `ComponentName.razor`
2. Blazor adds a unique attribute (e.g., `b-abc123`) to each element
3. CSS selectors are rewritten to include that attribute
4. Styles can't leak to other components

Special selectors:
- `::deep` — Pierces isolation to style child components (like `:global()` in CSS Modules)

**Where in code:** `Layout/MainLayout.razor.css`, `Layout/NavMenu.razor.css`, `Shared/*.razor.css`

---

## 13. @page — Routing Directive

`@page "/path"` makes a component routable — Blazor discovers routes automatically from these directives.

**React (centralized routing):**
```tsx
// App.tsx
<Route path="/basic-queries" element={<BasicQueries />} />
```

**Blazor (decentralized routing):**
```razor
@* BasicQueries.razor *@
@page "/basic-queries"
```

Key differences:
- **No central route file** — each component declares its own route
- Router in `App.razor` scans the assembly for `@page` directives
- A component can have **multiple** `@page` directives (multiple routes)
- Route parameters: `@page "/product/{Id:int}"`

**Where in code:** Every file in `Pages/` folder

---

## 14. NavLink Component

Blazor's built-in `NavLink` adds an `active` CSS class when the route matches — like React Router's `NavLink`.

**React:**
```tsx
import { NavLink } from 'react-router-dom';
<NavLink to="/basic-queries" className={({isActive}) => isActive ? 'active' : ''}>
  Basic Queries
</NavLink>
```

**Blazor:**
```razor
<NavLink href="/basic-queries" Match="NavLinkMatch.All" class="nav-item">
    Basic Queries
</NavLink>
```

Key differences:
- `href` instead of `to`
- `Match="NavLinkMatch.All"` = exact match (React's `end` prop)
- `Match="NavLinkMatch.Prefix"` = prefix match (React's default)
- Automatically adds `active` CSS class — no callback needed

**Where in code:** `Layout/NavMenu.razor`

---

## 15. LayoutComponentBase + @Body

Layouts wrap pages with shared UI — like React's layout pattern with `{children}`.

**React:**
```tsx
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

**Blazor:**
```razor
@inherits LayoutComponentBase

<div class="layout">
    <NavMenu />
    <main>@Body</main>
</div>
```

Key differences:
- `@inherits LayoutComponentBase` — marks this as a layout
- `@Body` instead of `{children}` — renders the current page
- Layout is set in `App.razor` via `DefaultLayout="@typeof(MainLayout)"`
- No need to wrap routes — all pages automatically use the layout

**Where in code:** `Layout/MainLayout.razor`

---

## 16. RenderFragment

`RenderFragment` is Blazor's type for "renderable content" — like React's `React.ReactNode` or `children`.

**React:**
```tsx
interface Props { children: React.ReactNode; }
function Card({ children }: Props) {
  return <div className="card">{children}</div>;
}
```

**Blazor:**
```razor
<div class="card">@ChildContent</div>

@code {
    [Parameter] public RenderFragment ChildContent { get; set; }
}
```

Key differences:
- `RenderFragment` is the type (like `React.ReactNode`)
- Convention: name it `ChildContent` for implicit content projection
- Can have **multiple** named render fragments (unlike React which has only `children`)

**Where in code:** `Layout/MainLayout.razor` (uses `@Body` which is a `RenderFragment`)

---

## 17. StateHasChanged()

`StateHasChanged()` tells Blazor to re-render the component — like React's `setState()` triggering a re-render.

**React:**
```tsx
const [loading, setLoading] = useState(false);
setLoading(true);  // Triggers re-render
```

**Blazor:**
```csharp
private bool loading = false;
loading = true;
StateHasChanged();  // Triggers re-render
```

Key differences:
- React: `setState` / `set` function automatically triggers re-render
- Blazor: Mutate the field, then call `StateHasChanged()` if needed
- **Auto-called** after event handlers (e.g., `@onclick`) — you rarely need to call it manually
- Only need to call it explicitly during async operations (before `await`)

**Where in code:** `Shared/DemoSection.razor` (explicit call before await in RunDemo)

---

## 18. NavigationManager

`NavigationManager` provides programmatic navigation — like React Router's `useNavigate()`.

**React:**
```tsx
const navigate = useNavigate();
navigate('/basic-queries');
```

**Blazor:**
```razor
@inject NavigationManager Nav

@code {
    protected override void OnInitialized()
    {
        Nav.NavigateTo("/basic-queries");
    }
}
```

Key differences:
- Injected via DI (`@inject`) — not a hook
- `NavigateTo(url)` instead of `navigate(url)`
- Also provides `Uri` (current URL) and `BaseUri` properties
- Can force-reload: `Nav.NavigateTo("/path", forceLoad: true)`

**Where in code:** `Pages/Home.razor` (redirect from `/` to `/basic-queries`)

---

## 19. Project Structure Comparison

```
React (northwind-client/)          Blazor (northwind-blazor/)
═══════════════════════            ═══════════════════════════
src/main.tsx                       Program.cs
src/App.tsx                        App.razor
src/layout/MainLayout.tsx          Layout/MainLayout.razor
src/layout/Sidebar.tsx             Layout/NavMenu.razor
src/components/DemoSection.tsx     Shared/DemoSection.razor
src/components/DataTable.tsx       Shared/DataTable.razor
src/components/CodeSnippet.tsx     Shared/CodeSnippet.razor
src/pages/BasicQueries.tsx         Pages/BasicQueries.razor
  (CSS Modules / inline styles)     (*.razor.css — CSS Isolation)
  (axios for HTTP)                   (HttpClient + ApiService.cs)
  (no DI — direct imports)          (DI in Program.cs)
  package.json                       NorthwindBlazor.csproj
  vite.config.ts                     Properties/launchSettings.json
  public/index.html                  wwwroot/index.html
```

---

## 20. Quick Reference Cheat Sheet

| Task | React | Blazor |
|------|-------|--------|
| Create component | `function Foo() {}` | `Foo.razor` file |
| Props | `{ title }: Props` | `[Parameter] public string Title` |
| State | `useState(initial)` | `private type field = initial;` |
| Event | `onClick={fn}` | `@onclick="fn"` |
| Conditional | `{cond && <div/>}` | `@if (cond) { <div/> }` |
| List | `arr.map(x => <li/>)` | `@foreach (var x in arr) { <li/> }` |
| Style (scoped) | CSS Modules | `.razor.css` files |
| Route | `<Route path="/x">` | `@page "/x"` |
| Nav link | `<NavLink to="/x">` | `<NavLink href="/x">` |
| Layout | `{children}` | `@Body` |
| Redirect | `<Navigate to="/x" />` | `Nav.NavigateTo("/x")` |
| HTTP GET | `axios.get(url)` | `await _http.GetAsync(url)` |
| DI | `import x from 'x'` | `@inject Service x` |
| Lifecycle | `useEffect(() => {}, [])` | `OnInitializedAsync()` |
| Re-render | `setState(...)` | `StateHasChanged()` |
| Type safety | TypeScript interfaces | C# classes/records |

---

## Key Takeaways for React Developers

1. **Blazor async/await is like React** — no Observables (unlike Angular)
2. **No Virtual DOM** — Blazor uses a RenderTree diff, but the concept is similar
3. **No hooks rules** — use fields and methods freely, no ordering constraints
4. **DI is mandatory** — services must be registered (like Angular, unlike React)
5. **CSS isolation is built-in** — `.razor.css` files, no extra tooling needed
6. **Routes are decentralized** — `@page` directives on each component
7. **C# is strongly typed** — `JsonElement` handles dynamic JSON (unlike JS's native objects)
8. **First load is larger** — .NET WASM runtime downloads once, then cached
