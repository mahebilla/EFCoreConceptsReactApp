/**
 * APP CONFIGURATION — Angular Concept: ApplicationConfig + Providers
 *
 * React equivalent: There's no direct equivalent. In React, you wrap your app
 * with context providers (e.g., <BrowserRouter>). In Angular, you register
 * "providers" in this config object which uses Dependency Injection (DI).
 *
 * Key Angular concepts here:
 * - provideZoneChangeDetection: Enables Zone.js change detection (auto-updates the UI)
 * - provideRouter: Registers the Angular Router (like wrapping React app with <BrowserRouter>)
 * - provideHttpClient: Registers HttpClient for DI (replaces installing axios in React)
 */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js detects async operations and triggers change detection automatically
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Register the router with our route definitions
    provideRouter(routes),

    // Register HttpClient — Angular's built-in HTTP library (replaces axios)
    // This makes HttpClient available via Dependency Injection everywhere in the app
    provideHttpClient(),
  ]
};
