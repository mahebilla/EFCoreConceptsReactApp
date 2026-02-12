using Microsoft.EntityFrameworkCore;
using NorthwindApi.Data;

var builder = WebApplication.CreateBuilder(args);

// === Services ===

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Prevent circular reference errors (Northwind has many circular nav properties)
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register DbContext — standard (used by most controllers)
var connectionString = builder.Configuration.GetConnectionString("NorthwindConnection");
builder.Services.AddDbContext<NorthwindContext>(options =>
    options.UseSqlServer(connectionString));

// Register a second DbContext with lazy loading proxies (for RelatedDataController)
builder.Services.AddDbContext<NorthwindLazyContext>(options =>
    options.UseLazyLoadingProxies()
           .UseSqlServer(connectionString));

// CORS for React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// === Middleware Pipeline ===

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevCors");
}

app.UseHttpsRedirection();

// Serve React build output from ../northwind-client/dist as static files
var spaPath = Path.Combine(app.Environment.ContentRootPath, "..", "northwind-client", "dist");
if (Directory.Exists(spaPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
            Path.GetFullPath(spaPath)),
        RequestPath = ""
    });
}

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

// SPA fallback — serve index.html for non-API routes (client-side routing)
app.MapFallbackToFile("index.html", new StaticFileOptions
{
    FileProvider = Directory.Exists(spaPath)
        ? new Microsoft.Extensions.FileProviders.PhysicalFileProvider(Path.GetFullPath(spaPath))
        : app.Environment.WebRootFileProvider
});

app.Run();
