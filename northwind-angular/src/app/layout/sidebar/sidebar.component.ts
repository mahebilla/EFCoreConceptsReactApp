/**
 * SIDEBAR COMPONENT — Angular Concept: RouterLink + RouterLinkActive
 *
 * React equivalent: Sidebar.tsx with NavLink from react-router-dom
 *
 * Key Angular concepts demonstrated:
 * 1. routerLink — Directive for navigation (like React's <NavLink to="...">)
 * 2. routerLinkActive — Adds CSS class when route is active (like NavLink's isActive)
 * 3. RouterLink, RouterLinkActive — Must be imported in standalone components
 * 4. @for — Template loop with track expression
 */
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Interface for navigation items — TypeScript enforces the shape.
 * In React, you might use a plain object array without an explicit interface.
 */
interface NavItem {
  path: string;
  label: string;
  desc: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,

  // Must import RouterLink and RouterLinkActive to use them in the template
  // React equivalent: import { NavLink } from 'react-router-dom'
  imports: [RouterLink, RouterLinkActive],

  template: `
    <nav style="width: 280px; min-width: 280px; background-color: #1a1a2e; color: #eee;
      padding: 16px; overflow-y: auto; display: flex; flex-direction: column;">

      <div style="margin-bottom: 24px;">
        <h2 style="color: #fff; font-size: 18px; margin: 0;">EF Core Methods</h2>
        <p style="color: #888; font-size: 11px; margin-top: 4px;">Northwind Database Demo (Angular)</p>
      </div>

      <!--
        @for — Angular 19 control flow loop
        React equivalent: {navItems.map(item => <NavLink key={item.path} ...>)}
        track item.path — unique identifier (like React's key prop)
      -->
      @for (item of navItems; track item.path) {
        <!--
          routerLink — Angular Concept: Router Navigation Directive
          React equivalent: <NavLink to={item.path}>

          [routerLink]="item.path" — Property binding with dynamic value
          routerLinkActive="active" — Adds 'active' CSS class when this route matches
          React equivalent: NavLink's style={({ isActive }) => ({...})}

          In Angular, we use CSS classes instead of inline style functions.
        -->
        <a [routerLink]="item.path"
           routerLinkActive="active"
           class="nav-link">
          <div style="font-weight: 600; font-size: 13px;">{{ item.label }}</div>
          <div style="font-size: 10px; color: #777; margin-top: 2px;">{{ item.desc }}</div>
        </a>
      }
    </nav>
  `,

  /**
   * styles — Angular Concept: Component-Scoped CSS (View Encapsulation)
   *
   * React equivalent: There's no direct equivalent. React uses inline styles
   * or CSS modules. Angular automatically scopes CSS to this component only —
   * styles defined here won't leak to other components.
   *
   * This is one of Angular's key advantages: built-in style encapsulation.
   */
  styles: [`
    .nav-link {
      display: block;
      padding: 10px 12px;
      margin-bottom: 2px;
      color: #aaa;
      background-color: transparent;
      border-radius: 6px;
      text-decoration: none;
      border-left: 3px solid transparent;
      transition: all 0.15s ease;
    }

    /* routerLinkActive adds the 'active' class automatically */
    .nav-link.active {
      color: #fff;
      background-color: #16213e;
      border-left: 3px solid #0066cc;
    }

    .nav-link:hover {
      color: #ddd;
      background-color: #16213e44;
    }
  `],
})
export class SidebarComponent {
  /**
   * Navigation items array — same data as React's Sidebar.tsx navItems.
   * In Angular, component data is defined as class properties.
   * React equivalent: const navItems = [...] (defined outside the component or with useMemo)
   */
  navItems: NavItem[] = [
    { path: '/basic-queries', label: 'Basic Queries', desc: 'Where, Find, First, Count, Aggregates, GroupBy, Join' },
    { path: '/raw-sql', label: 'Raw SQL', desc: 'FromSql, FromSqlRaw, SqlQuery, ExecuteSql' },
    { path: '/related-data', label: 'Related Data', desc: 'Include, ThenInclude, Explicit, Lazy Loading' },
    { path: '/tracking', label: 'Tracking', desc: 'AsNoTracking, IdentityResolution, Comparison' },
    { path: '/crud-operations', label: 'CRUD Operations', desc: 'Add, Update, Remove, Attach, SaveChanges' },
    { path: '/bulk-operations', label: 'Bulk Operations', desc: 'ExecuteUpdate, ExecuteDelete' },
    { path: '/transactions', label: 'Transactions', desc: 'BeginTransaction, Savepoints, Rollback' },
    { path: '/compiled-queries', label: 'Compiled Queries', desc: 'CompileQuery, CompileAsyncQuery' },
    { path: '/global-filters', label: 'Global Filters', desc: 'HasQueryFilter, IgnoreQueryFilters' },
    { path: '/change-tracker', label: 'Change Tracker', desc: 'Entries, EntityState, OriginalValues' },
    { path: '/stored-procedures', label: 'Stored Procedures', desc: 'FromSqlRaw with SPs' },
    { path: '/pagination', label: 'Pagination', desc: 'Skip/Take, Keyset pagination' },
  ];
}
