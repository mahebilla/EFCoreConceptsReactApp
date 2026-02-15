/**
 * API SERVICE — Blazor Concept: Injectable Service with HttpClient
 *
 * React equivalent: Direct axios calls or a custom api.ts module
 * Angular equivalent: api.service.ts with @Injectable and HttpClient
 *
 * Key Blazor concepts:
 * 1. Service class registered with DI in Program.cs (AddScoped<ApiService>)
 * 2. Constructor injection of HttpClient (like Angular's constructor DI)
 * 3. async/await with Task<T> — like React's async/await with Promises
 * 4. Returns Task (not Observable like Angular) — closer to React's pattern!
 *
 * Comparison:
 *   React:   const res = await axios.get('/api/...'); return res.data;
 *   Angular: this.http.get('/api/...').subscribe(data => ...)
 *   Blazor:  var json = await _http.GetStringAsync('/api/...');
 *
 * Blazor's async/await is MORE similar to React than Angular.
 * No Observables, no subscribe() — just familiar async/await.
 */
using System.Net.Http.Json;
using System.Text.Json;

namespace NorthwindBlazor.Services;

public class ApiService
{
    private readonly HttpClient _http;

    // Constructor injection — Blazor DI provides HttpClient automatically
    // React equivalent: No DI, just "import axios from 'axios'"
    // Angular equivalent: constructor(private http: HttpClient) {}
    public ApiService(HttpClient http)
    {
        _http = http;
    }

    /// <summary>
    /// Generic request method handling all HTTP methods.
    /// Returns JsonElement for flexible dynamic JSON handling.
    ///
    /// React equivalent: axios({ method, url, data })
    /// Angular equivalent: this.http[method](endpoint, body)
    /// </summary>
    public async Task<JsonElement> RequestAsync(string method, string endpoint, object? body = null)
    {
        // C# switch expression — like a compact switch statement
        // React/JS equivalent: const response = method === 'POST' ? await axios.post(...) : ...
        HttpResponseMessage response = method.ToUpper() switch
        {
            "POST" => await _http.PostAsJsonAsync(endpoint, body),
            "PUT" => await _http.PutAsJsonAsync(endpoint, body),
            "DELETE" => await _http.DeleteAsync(endpoint),
            _ => await _http.GetAsync(endpoint),  // _ is the default case (like "default:" in switch)
        };

        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }
}
