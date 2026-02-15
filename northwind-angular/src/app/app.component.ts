/**
 * ROOT COMPONENT — Angular Concept: Application Shell
 *
 * React equivalent: App.tsx wrapped in <BrowserRouter>
 *
 * Key Angular concepts:
 * 1. @Component — Decorator that defines this as a component
 * 2. selector: 'app-root' — Matches <app-root> in index.html
 * 3. RouterOutlet — Where routed components render (like React's <Routes>)
 * 4. imports — Declares dependencies for standalone components
 *
 * In React: <MainLayout><Routes>...</Routes></MainLayout>
 * In Angular: <app-main-layout><router-outlet /></app-main-layout>
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  // 'app-root' matches the <app-root></app-root> tag in src/index.html
  selector: 'app-root',
  standalone: true,

  // Declare what this component uses in its template
  imports: [RouterOutlet, MainLayoutComponent],

  /**
   * Using inline template instead of templateUrl.
   *
   * <app-main-layout> — Our layout component (sidebar + content area)
   *   <router-outlet /> — Angular renders the matched route's component HERE
   *
   * The content between <app-main-layout> tags gets projected into
   * the <ng-content> slot inside MainLayoutComponent.
   *
   * React equivalent:
   *   <MainLayout>
   *     <Routes>
   *       <Route path="..." element={<Component />} />
   *     </Routes>
   *   </MainLayout>
   */
  template: `
    <app-main-layout>
      <router-outlet />
    </app-main-layout>
  `,
})
export class AppComponent {}
