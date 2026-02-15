/**
 * DATA TABLE COMPONENT — Angular Concept: Standalone Component + @Input
 *
 * React equivalent: DataTable.tsx — a functional component receiving props.
 *
 * Key Angular concepts demonstrated:
 * 1. @Component decorator — Defines metadata (selector, template, styles)
 * 2. standalone: true — No NgModule needed (Angular 19 default)
 * 3. @Input() — Receives data from parent (like React props)
 * 4. Inline template — Using `template` instead of a separate HTML file
 * 5. @for / @if — Angular 19 control flow (replaces *ngFor / *ngIf)
 * 6. Template expressions — {{ value }} interpolation (like JSX {value})
 */
import { Component, Input } from '@angular/core';

@Component({
  // selector: How parent components reference this: <app-data-table>
  // React equivalent: Just the component name <DataTable />
  selector: 'app-data-table',

  // standalone: true means this component doesn't need an NgModule
  // This is the Angular 19 default — similar to React's self-contained components
  standalone: true,

  // Angular template syntax — the HTML that renders this component
  // React equivalent: The JSX returned from the function component
  template: `
    <!-- @if — Angular 19 control flow (replaces *ngIf) -->
    <!-- React equivalent: {(!data || data.length === 0) && <p>No data</p>} -->
    @if (!data || data.length === 0) {
      <p style="color: #888; font-style: italic;">No data returned.</p>
    } @else {
      <div style="margin-top: 12px; overflow-x: auto;">
        @if (title) {
          <h4 style="margin-bottom: 8px;">{{ title }}</h4>
        }
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr>
              <!-- @for — Angular 19 loop (replaces *ngFor) -->
              <!-- React equivalent: {columns.map(col => <th key={col}>...)} -->
              <!-- track col — Required unique identifier (like React's key prop) -->
              @for (col of columns; track col) {
                <th style="border-bottom: 2px solid #ddd; padding: 8px 10px; text-align: left;
                  background-color: #f0f0f0; font-weight: 600; font-size: 12px;
                  color: #555; text-transform: uppercase; letter-spacing: 0.5px;">
                  {{ col }}
                </th>
              }
            </tr>
          </thead>
          <tbody>
            <!-- $index is a built-in @for variable (like the index in .map()) -->
            @for (row of data; track $index) {
              <tr [style.background-color]="$index % 2 === 0 ? '#fff' : '#fafafa'">
                @for (col of columns; track col) {
                  <td style="border-bottom: 1px solid #eee; padding: 7px 10px; font-size: 13px;">
                    {{ formatValue(row[col]) }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
        <div style="font-size: 11px; color: #999; margin-top: 4px;">
          {{ data.length }} row{{ data.length !== 1 ? 's' : '' }}
        </div>
      </div>
    }
  `,
})
export class DataTableComponent {
  /**
   * @Input() — Angular Concept: Component Inputs (like React props)
   *
   * React equivalent: function DataTable({ data, title }: Props)
   *
   * @Input() marks a property as receivable from parent components.
   * Parent uses: <app-data-table [data]="myData" [title]="'My Title'">
   * The [square brackets] indicate property binding (one-way data flow).
   */
  @Input() data: Record<string, any>[] = [];
  @Input() title?: string;

  /**
   * Computed property — gets column names from the first data row.
   *
   * Angular concept: TypeScript getter (runs on every change detection cycle)
   * React equivalent: const columns = Object.keys(data[0]) inside the component
   */
  get columns(): string[] {
    return this.data && this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }

  /** Format cell values for display */
  formatValue(val: unknown): string {
    if (val === null || val === undefined) return '';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }
}
