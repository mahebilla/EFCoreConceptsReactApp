/**
 * PROGRAM.CS — Blazor Concept: Application Entry Point & Dependency Injection
 *
 * React equivalent: main.tsx (renders <App /> into the DOM)
 * Angular equivalent: app.config.ts (registers providers for DI)
 *
 * Key Blazor concepts:
 * 1. WebAssemblyHostBuilder — Configures services and builds the WASM host
 * 2. builder.Services.AddScoped<T>() — DI registration (like Angular's providedIn: 'root')
 * 3. HttpClient — Configured with base address pointing to our API
 *
 * Blazor runs C# in the browser via WebAssembly — no JavaScript needed for app logic.
 * The app downloads the .NET runtime + your DLLs, then runs natively in the browser.
 *
 * In React, there's no DI — you just import modules directly.
 * Blazor (like Angular) uses DI to manage service lifetimes and testability.
 */
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using NorthwindBlazor;
using NorthwindBlazor.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Add the root component — renders <App> into the #app div in index.html
// React equivalent: createRoot(document.getElementById('root')!).render(<App />)
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register HttpClient with the API base address
// React equivalent: axios.defaults.baseURL = 'http://localhost:5009'
// Angular equivalent: proxy.conf.json redirects /api → localhost:5009
// Blazor doesn't use a proxy — it calls the API directly (CORS is configured on the API)
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri("http://localhost:5009")
});

// Register our custom API service for DI
// React equivalent: No registration needed — just import and use axios
// Angular equivalent: @Injectable({ providedIn: 'root' })
builder.Services.AddScoped<ApiService>();

await builder.Build().RunAsync();
