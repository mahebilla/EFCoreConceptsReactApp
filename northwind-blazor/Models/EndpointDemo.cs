/**
 * ENDPOINT DEMO MODEL — Blazor Concept: C# Records as Data Models
 *
 * React equivalent: EndpointDemo interface in DemoSection.tsx
 * Angular equivalent: endpoint-demo.model.ts
 *
 * In React/Angular, you use TypeScript interfaces (compile-time only, erased at runtime).
 * In Blazor, you use C# classes or records (exist at runtime, serializable).
 *
 * C# record — An immutable reference type with value-based equality.
 * Records auto-generate: constructor, ToString(), Equals(), GetHashCode().
 *
 * Comparison:
 *   React/TS:  interface EndpointDemo { name: string; endpoint: string; ... }
 *   Blazor/C#: record EndpointDemo(string Name, string Endpoint, ...);
 *
 * Records use "positional parameters" (the constructor arguments).
 * This is the most concise way to define a data carrier in C#.
 */
namespace NorthwindBlazor.Models;

public record EndpointDemo(
    string Name,
    string Endpoint,
    string Method,        // "GET", "POST", "PUT", "DELETE"
    string Code,
    string Description,
    object? Body = null   // Optional request body for POST/PUT
);
