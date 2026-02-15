/**
 * API SERVICE — Angular Concept: Services + Dependency Injection (DI)
 *
 * React equivalent: In React, you'd use axios directly in components or create
 * a custom hook (useApi). Angular uses a different pattern:
 *
 * 1. @Injectable() — Decorator that marks this class as available for DI
 * 2. providedIn: 'root' — Registers as a singleton (one instance shared app-wide)
 * 3. HttpClient — Angular's built-in HTTP library (replaces axios)
 * 4. Observable — RxJS streams (Angular uses Observables instead of Promises)
 *
 * In Angular, services handle business logic and API calls.
 * Components inject services via constructor parameters.
 * This separation of concerns is a core Angular pattern.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  // providedIn: 'root' means Angular creates a single instance (singleton)
  // and makes it available everywhere — no need to add it to a providers array.
  // React equivalent: A module-level singleton or React Context.
  providedIn: 'root'
})
export class ApiService {

  /**
   * Constructor Injection — Angular Concept: Dependency Injection
   *
   * Angular automatically provides an HttpClient instance when this service
   * is created. You just declare it as a constructor parameter.
   *
   * React equivalent: There's no direct equivalent. In React, you'd import
   * axios at the top of the file. Angular's DI makes testing easier because
   * you can swap HttpClient with a mock in tests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Generic request method that handles all HTTP methods.
   *
   * Returns an Observable<any> — Angular Concept: Observables (RxJS)
   *
   * React equivalent: This would return a Promise (from axios).
   * Observables are like Promises but more powerful:
   * - Can emit multiple values over time (Promise resolves once)
   * - Can be cancelled (Promises can't)
   * - Have operators like map, filter, retry, debounce
   *
   * In this app, we use .subscribe() to handle the response,
   * which is similar to .then() on a Promise.
   */
  request(method: string, endpoint: string, body?: unknown): Observable<any> {
    switch (method.toUpperCase()) {
      case 'POST':
        return this.http.post(endpoint, body);
      case 'PUT':
        return this.http.put(endpoint, body);
      case 'DELETE':
        return this.http.delete(endpoint);
      default:
        return this.http.get(endpoint);
    }
  }
}
