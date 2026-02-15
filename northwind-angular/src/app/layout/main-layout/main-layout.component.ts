/**
 * MAIN LAYOUT COMPONENT — Angular Concept: Content Projection (<ng-content>)
 *
 * React equivalent: MainLayout.tsx using {children} prop
 *
 * Key Angular concept demonstrated:
 * <ng-content> — Angular's slot mechanism for projecting child content.
 *
 * React uses {children} prop:
 *   function MainLayout({ children }) { return <div>{children}</div> }
 *
 * Angular uses <ng-content> tag:
 *   <div><ng-content></ng-content></div>
 *
 * Both achieve the same result — the parent can pass arbitrary content
 * into a designated slot in the layout component.
 */
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,

  // Import child components used in the template
  imports: [SidebarComponent],

  template: `
    <div style="display: flex; min-height: 100vh;">
      <!-- Sidebar navigation -->
      <app-sidebar></app-sidebar>

      <!-- Main content area -->
      <main style="flex: 1; padding: 24px 32px; overflow-y: auto; background-color: #f5f5f5;">
        <!--
          <ng-content> — Angular Concept: Content Projection (Transclusion)

          React equivalent: {children}

          Whatever the parent puts between <app-main-layout>...</app-main-layout>
          will be rendered here. This is how the router-outlet content appears
          inside the layout.

          Angular also supports named slots:
            <ng-content select="[header]"></ng-content>
            <ng-content select="[footer]"></ng-content>
          which is like React's named children pattern.
        -->
        <ng-content></ng-content>
      </main>
    </div>
  `,
})
export class MainLayoutComponent {}
