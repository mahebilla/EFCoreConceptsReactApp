/**
 * DEMO SECTION COMPONENT — Angular Concept: Stateful Component with DI + Signals
 *
 * React equivalent: DemoSection.tsx
 *
 * This is the CORE component of the app. Key Angular concepts demonstrated:
 *
 * 1. signal() — Angular 19 reactive state (like React's useState)
 * 2. inject() — Function-based dependency injection (like React's useContext)
 * 3. (click) — Event binding (like React's onClick)
 * 4. [disabled] — Property binding (like React's disabled={condition})
 * 5. [style.backgroundColor] — Individual style binding
 * 6. @for / @if — Control flow in templates
 * 7. JsonPipe — Built-in pipe for formatting JSON (like JSON.stringify in JSX)
 */
import { Component, Input, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EndpointDemo } from '../../models/endpoint-demo.model';
import { DataTableComponent } from '../data-table/data-table.component';
import { CodeSnippetComponent } from '../code-snippet/code-snippet.component';

@Component({
  selector: 'app-demo-section',
  standalone: true,

  /**
   * imports — Angular Concept: Component Dependencies
   *
   * React equivalent: import statements at the top of the file.
   * In Angular, standalone components must declare which other components,
   * directives, and pipes they use in their template.
   *
   * JsonPipe is Angular's built-in {{ value | json }} pipe.
   */
  imports: [DataTableComponent, CodeSnippetComponent, JsonPipe],

  template: `
    <div>
      <h1>{{ title }}</h1>
      <p style="color: #666; margin-bottom: 20px;">{{ subtitle }}</p>

      <!-- Loop through each demo and render a card -->
      @for (demo of demos; track demo.name) {
        <div style="margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px;
          padding: 16px; background-color: #fff;">

          <!-- Header with name and HTTP method badge -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3>{{ demo.name }}</h3>
              <p style="color: #666; font-size: 13px; margin-top: 2px;">{{ demo.description }}</p>
            </div>
            <!--
              getMethodColor() — Angular calls methods in templates.
              React equivalent: inline expression in JSX.
              Note: Angular re-evaluates template expressions on every change detection.
            -->
            <span [style.background-color]="getMethodColor(demo.method)"
              style="padding: 2px 8px; border-radius: 4px; font-size: 11px;
              font-weight: 700; color: #fff;">
              {{ demo.method }}
            </span>
          </div>

          <!-- C# code snippet -->
          <app-code-snippet [code]="demo.code" [title]="'C# Backend Code'"></app-code-snippet>

          <!--
            (click) — Angular Concept: Event Binding
            React equivalent: onClick={() => runDemo(demo)}
            Angular uses (parentheses) for events, React uses onEventName props.
          -->
          <button
            (click)="runDemo(demo)"
            [disabled]="loading()[demo.name]"
            [style.background-color]="loading()[demo.name] ? '#ccc' : '#0066cc'"
            style="margin-top: 12px; padding: 8px 20px; color: #fff; border: none;
              border-radius: 4px; font-size: 13px; font-weight: 600;">
            {{ loading()[demo.name] ? 'Loading...' : 'Run ' + demo.method + ' Request' }}
          </button>

          <!-- Display results if available -->
          @if (results()[demo.name]) {
            <div style="margin-top: 12px;">
              @if (results()[demo.name]?.error) {
                <div style="color: #dc3545; padding: 8px; background-color: #f8d7da; border-radius: 4px;">
                  Error: {{ results()[demo.name].error }}
                </div>
              } @else {
                <div style="background-color: #f8f9fa; padding: 12px; border-radius: 6px;
                  border: 1px solid #e9ecef;">
                  @if (getMethod(results()[demo.name])) {
                    <div style="font-weight: 600; color: #16213e; margin-bottom: 4px;">
                      Method: {{ getMethod(results()[demo.name]) }}
                    </div>
                  }
                  @if (getDescription(results()[demo.name])) {
                    <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                      {{ getDescription(results()[demo.name]) }}
                    </div>
                  }

                  <!-- Render array data as table, objects as JSON -->
                  @if (isArray(getData(results()[demo.name]))) {
                    <app-data-table [data]="getData(results()[demo.name])"></app-data-table>
                  } @else {
                    <!--
                      | json — Angular Concept: Pipes
                      Pipes transform data in templates. The json pipe formats objects.
                      React equivalent: JSON.stringify(data, null, 2) in JSX.
                      Angular has many built-in pipes: date, currency, uppercase, etc.
                    -->
                    <pre style="background-color: #fff; padding: 10px; border-radius: 4px;
                      border: 1px solid #e0e0e0; font-size: 12px; overflow-x: auto;">
                      {{ results()[demo.name] | json }}
                    </pre>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DemoSectionComponent {
  /** Page title */
  @Input() title: string = '';

  /** Subtitle / description */
  @Input() subtitle: string = '';

  /** Array of demos to render */
  @Input() demos: EndpointDemo[] = [];

  /**
   * inject() — Angular 19 Concept: Function-based Dependency Injection
   *
   * React equivalent: There's no direct equivalent. In React you'd import axios.
   * In Angular, inject() retrieves a service instance from the DI container.
   * This is the modern alternative to constructor injection:
   *   constructor(private apiService: ApiService) {}
   *
   * Both approaches work — inject() is preferred in Angular 19 for standalone components.
   */
  private apiService = inject(ApiService);

  /**
   * signal() — Angular 19 Concept: Signals (Reactive State)
   *
   * React equivalent: const [results, setResults] = useState({})
   *
   * Signals are Angular's new reactive primitives:
   * - signal(initialValue) — creates reactive state
   * - Read value: this.results() — note the () to call it
   * - Update value: this.results.set(newValue) or this.results.update(fn)
   *
   * Unlike React's useState, signals don't require re-rendering the entire component.
   * Angular only updates the specific DOM nodes that depend on the changed signal.
   */
  results = signal<Record<string, any>>({});
  loading = signal<Record<string, boolean>>({});

  /**
   * Run a demo by calling the API endpoint.
   *
   * Uses Observable.subscribe() — Angular Concept: Observables (RxJS)
   *
   * React equivalent: await axios.get(...).then(res => setResults(...))
   *
   * Observable.subscribe() is like Promise.then() but:
   * - Can receive multiple values over time
   * - Has next (success), error, and complete callbacks
   * - Should be unsubscribed to prevent memory leaks (not needed here — HTTP completes automatically)
   */
  runDemo(demo: EndpointDemo): void {
    // Update loading state using signal.update()
    // React equivalent: setLoading(prev => ({ ...prev, [demo.name]: true }))
    this.loading.update(prev => ({ ...prev, [demo.name]: true }));

    this.apiService.request(demo.method, demo.endpoint, demo.body).subscribe({
      // next — called when the HTTP response arrives (like .then())
      next: (data) => {
        this.results.update(prev => ({ ...prev, [demo.name]: data }));
        this.loading.update(prev => ({ ...prev, [demo.name]: false }));
      },
      // error — called if the request fails (like .catch())
      error: (err) => {
        this.results.update(prev => ({
          ...prev,
          [demo.name]: { error: err.message || 'Unknown error' }
        }));
        this.loading.update(prev => ({ ...prev, [demo.name]: false }));
      },
    });
  }

  /** Get HTTP method badge color */
  getMethodColor(method: string): string {
    switch (method) {
      case 'GET': return '#28a745';
      case 'POST': return '#007bff';
      case 'PUT': return '#ffc107';
      case 'DELETE': return '#dc3545';
      default: return '#6c757d';
    }
  }

  /** Helper: extract method name from API response */
  getMethod(result: any): string {
    return result?.method || result?.Method || '';
  }

  /** Helper: extract description from API response */
  getDescription(result: any): string {
    return result?.description || result?.Description || '';
  }

  /** Helper: extract data array from API response */
  getData(result: any): any {
    return result?.data || result?.Data;
  }

  /** Helper: check if value is an array */
  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}
