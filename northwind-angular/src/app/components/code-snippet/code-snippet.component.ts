/**
 * CODE SNIPPET COMPONENT — Angular Concept: Simple Presentational Component
 *
 * React equivalent: CodeSnippet.tsx
 *
 * This is a "dumb" / "presentational" component — it only displays data
 * passed via @Input(), with no internal state or logic.
 * Both React and Angular share this pattern of separating presentation from logic.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  template: `
    <div style="margin-top: 10px; background-color: #1e1e1e; border-radius: 6px; overflow: hidden;">
      <!-- @if — conditionally render the title bar -->
      @if (title) {
        <div style="padding: 6px 14px; background-color: #2d2d2d; color: #aaa;
          font-size: 11px; font-weight: 600;">
          {{ title }}
        </div>
      }
      <!--
        [innerHTML] — Angular Concept: Property Binding
        We use <pre><code> for preformatted code display.
        In Angular, {{ }} auto-escapes HTML. For raw text in <pre>, we just use interpolation.
      -->
      <pre style="padding: 14px; margin: 0; color: #d4d4d4; font-size: 12px;
        line-height: 1.5; overflow-x: auto;
        font-family: Consolas, Monaco, 'Courier New', monospace;">
        <code>{{ code }}</code>
      </pre>
    </div>
  `,
})
export class CodeSnippetComponent {
  /** The code string to display */
  @Input() code: string = '';

  /** Optional header title above the code block */
  @Input() title?: string;
}
