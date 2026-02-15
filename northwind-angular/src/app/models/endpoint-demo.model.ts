/**
 * INTERFACE — Angular Concept: TypeScript Interfaces for Type Safety
 *
 * React equivalent: Same! Both React and Angular use TypeScript interfaces.
 * In the React version, this was defined inside DemoSection.tsx as `EndpointDemo`.
 * In Angular, we put shared interfaces in a separate models/ folder — a common convention.
 *
 * Angular convention: Files are named with a suffix like `.model.ts`, `.service.ts`, `.component.ts`
 */
export interface EndpointDemo {
  /** Display name shown in the demo card header */
  name: string;

  /** API endpoint path, e.g. '/api/basicqueries/where' */
  endpoint: string;

  /** HTTP method — determines button color and request type */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';

  /** C# code snippet shown in the code block */
  code: string;

  /** Short description of what this demo does */
  description: string;

  /** Optional JSON body for POST/PUT requests */
  body?: unknown;
}
