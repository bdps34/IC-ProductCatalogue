# Product Catalog Challenge

## Task

Build a Product Catalog Single Page Application (SPA) for browsing and managing products. You will use the **Fake Store API** https://fakestoreapi.com/ as your data source.

### Requirements:

- **Overview Page:** Implement an overview page that displays a list of products with their title, image, price, and a truncated description.
- **Detail Page:** Implement a product detail page that shows the complete product information (full description, category, ratings, etc.).
- **Product Creation:** Create a form to simulate adding a new product to the catalog.
- **Best Practices:** Consider UX best practices, accessibility, and web semantics. It doesn't have to look incredibly fancy, but it should be clean and highly usable.
- **Getting Started:** Use the pre-configured `@ngneat/query` setup to manage your API state efficiently.

---

## What We Look For

This challenge is not about racing to finish every single requirement; it's about showing us how you work, how you think, and what you value as an engineer. **Please invest no more than 2 to 3 hours of your time.**

Please organize, design, test, and document your solution the way you normally would in a production environment. We understand that this timeline requires trade-offs.

The use of AI is mandatory, but the ownership of every technical decision is yours.

### Documentation Requirement:

Please use the bottom of this README to document:

- Your technical trade-offs and the rationale behind your choices.
- What you would do differently, or what you would focus on next if you had more time (e.g., specific architectural improvements, edge-case testing, advanced UI features).

---

## Submission

Clone this repo and send us the link to your repository when you are finished. This should be completed at least **24 hours before your scheduled interview**. We will walk through your codebase and discuss your solution together during the interview.

---

## Helpful Links

- [Fake Store API Docs](https://fakestoreapi.com/docs)
- [@ngneat/query Documentation](https://github.com/ngneat/query)
- [Angular Documentation](https://angular.dev/)

---

## Development & Tooling

This project was generated using Angular CLI version 21.2.11.

### Tech stack

- Angular 21
- TypeScript
- SCSS
- `@ngneat/query` for server-state management
- Angular Signal Forms for product creation (experimental)
- Vitest for unit testing

### Prerequisites

- Node.js
- npm

### Installation

Install the project dependencies:

```bash
npm install
```

### Development Server

To start a local development server, run:

```bash
npm start
```

The app will be available at `http://localhost:4200/` as default.

### Build

To build the project for production:

```bash
npm run build
```

Build artifacts are output to `dist/`.

### Unit Tests

To run the unit test suite:

```bash
npm test
```

## Engineering Considerations

Beyond the functional requirements, I focused on:

- **Accessibility:** semantic HTML, keyboard navigation, accessible forms and meaningful focus states.
- **Maintainability:** feature-oriented organization, strict typing and clear separation between UI and data access.
- **Reliability:** explicit loading, error, empty and validation states.
- **Performance:** efficient server-state caching and appropriate image loading.
- **Responsiveness:** usable layouts across desktop and smaller viewports.
- **Testability:** coverage focused on meaningful user behavior.

## Technical Decisions & Trade-offs

### Server state and caching

I used @ngneat/query for remote product state and caching. Introducing an additional global store would duplicate responsibilities without providing enough value for the current scope.  
I intentionally kept the caching strategy simple. In production, acceptable staleness should be treated as a product requirement—particularly for data such as price or availability—and staleTime, refetching and mutation invalidation configured accordingly.

### Query result shape

Components consume a small QueryState<T> discriminated union rather than depending directly on @ngneat/query's QueryObserverResult. A single toQueryState() mapper translates the library state into application state, keeping query-library-specific details within the data-access layer. I expose this state as Observable<QueryState<T>> because it integrates cleanly with dynamic values such as route parameters while avoiding injection-context constraints encountered when wrapping the library's signal-based result. This adds a small mapping layer but keeps components simpler and less coupled to the query library.

### Application structure

I used a feature-oriented structure, keeping product-specific pages, components, models, and data access colocated under features/products. Although the current application is small enough for a flatter structure, the additional organizational cost is minimal and provides clear ownership boundaries if the application grows.

Domain-agnostic UI primitives live under ui, while application-shell components such as the header and footer are kept under layout. I intentionally kept these shared areas small and only extracted components that currently have a reusable responsibility, rather than creating abstractions for hypothetical future requirements.

### Routing and lazy loading

The catalog is the landing page and is loaded eagerly. I also kept the small detail page eager because it shares most of its dependencies with the catalog and introduces little additional code. The creation flow is a better lazy-loading boundary because it introduces its own form-handling code and is not required by every visitor.

### Reusable button component

I introduced a shared `Button` component under `ui/` because the application requires the same visual primitive across multiple contexts, with primary/secondary variants and disabled/loading states.

The component renders either a native `<button>` for actions or an `<a>` for navigation. This preserves native browser behavior and accessibility semantics rather than implementing navigation through button click handlers.

The navigation input was intentionally named `link` rather than `routerLink`. An initial `routerLink` input collided with Angular's `RouterLink` directive when both were present on the component host, resulting in duplicate navigation behavior and an additional keyboard focus target. Using a distinct input name avoids coupling the component API to Angular's directive selector and prevents that collision.

### Image loading

I used NgOptimizedImage for catalog images without marking a specific image as priority. I evaluated prioritizing the first product, but in a responsive multi-column grid the actual LCP candidate can vary depending on the viewport and rendered layout, making an index-based heuristic unreliable.

Given the scope of the challenge, I chose not to introduce additional runtime logic purely to determine the LCP candidate. With more time, I would profile Core Web Vitals across representative viewport sizes and optimize image loading based on measured results.

### Signal Forms for product creation

The create-product form uses Angular Signal Forms (`form()`, `[formField]`, `[formRoot]`) instead of the Reactive Forms approach specified in the project's `CLAUDE.md`. This was a deliberate deviation to evaluate Angular's newer Signal Forms API in a small, contained feature.

For this form, Signal Forms reduced boilerplate and integrated naturally with the application's signal-based state: validation, touched/dirty state, and submit availability can be consumed directly as signals.

The trade-off is API stability. Signal Forms is currently experimental, so future Angular versions may introduce breaking changes that require this form to be adapted. Given the small and isolated scope of the creation flow, I considered that risk acceptable for this challenge.

### Reusable text field scope

The shared `TextField` component covers the repeated label, text input/textarea, and validation-error pattern used by the title, image URL, and description fields.

It intentionally accepts only `FieldTree<string>`. Generalizing it across string and numeric fields introduced unnecessary complexity around Signal Forms' strongly typed `[formField]` binding. Since price is currently the only numeric field, I kept it explicit rather than broadening the abstraction for a single use case.

If additional numeric fields were introduced, I would consider a dedicated `NumberField` component rather than making `TextField` unnecessarily generic.

### Styling and design tokens

I added a small set of shared design tokens in styles/theme.scss for values such as spacing, sizing, and other reusable visual properties. Although the application is small enough to work without this abstraction, centralizing these values has very little overhead and helps keep the UI consistent as it evolves.

Component sizing and spacing primarily use rem units, allowing the interface to scale with the user's root font size rather than relying on fixed pixel values. Responsive behavior is intentionally lightweight, using the layout itself and a small number of media queries rather than introducing a large set of responsive variables or utility classes.

### AI tooling

I used a project-level CLAUDE.md to provide persistent coding and architectural guidelines to the AI assistant. Given the small scope and time-boxed nature of the challenge, I kept the AI setup intentionally lightweight rather than introducing custom agents or reusable skills, which would add configuration overhead without a clear benefit for this project.

I also used the Angular MCP server to provide Angular-specific tooling and context. The MCP configuration was kept local and was intentionally not committed, as it is part of my development environment rather than a requirement for running the application.

## With More Time

### Query stale time

`@ngneat/query`'s default `staleTime` is `0`, so remounting the list or detail page can trigger a background refetch even when cached data is available. For this effectively static demo API, a non-zero `staleTime` could avoid redundant requests. In production, I would first establish acceptable data freshness requirements and configure stale time and refetch behavior accordingly.

### Pagination and large dataset handling

The current catalog loads the complete product collection, which is appropriate for the small Fake Store dataset. For a production-sized catalog, I would introduce server-side pagination and evaluate virtual scrolling if the UX required rendering large result sets.

### Skeleton loading states (CLS)

Replace the compact loading indicator with card-shaped skeletons that reserve approximately the same space as the loaded catalog. This would provide better perceived loading feedback and reduce layout shift (CLS) when products arrive.

### Authentication and authorization

Product creation is currently available to every user because authentication is outside the challenge scope. In production, mutation operations should require authentication and appropriate permissions, enforced by the backend and reflected in the UI.

### Internationalization

Introduce internationalization and localization support for user-facing text, locale-aware currency formatting, and other locale-dependent content.

### Responsive design

Further refine the mobile experience and test additional viewport and content combinations, introducing additional breakpoints where the natural layout behavior is insufficient.

### Image performance

Profile Core Web Vitals across representative viewport sizes and optimize the actual LCP behavior based on measured results rather than relying on an index-based `priority` heuristic.

### Success feedback after creating a product

Provide explicit success feedback after creating a product. A shared toast/snackbar mechanism would give users confirmation without disrupting the page layout and could later support feedback for other application actions.

### Warn before losing unsaved form input

Warn users before leaving a dirty creation form. In-app navigation could be protected with a `CanDeactivate` guard, with browser-level navigation handled separately where appropriate.

### Integration, end-to-end and unit testing

The current implementation includes unit tests covering meaningful component and application behavior, although I'm testing mainly the happy-paths. With more time, I would expand unit coverage around edge cases, complement these with integration and end-to-end tests covering critical user journeys such as browsing product details and creating a product, as well as automated accessibility checks against the rendered application.

### Observability

In a production environment, integrate client-side error reporting and performance monitoring to detect runtime errors, API failures, and Core Web Vitals regressions.

### Filtering, sorting and search

A natural evolution of the catalog would be filtering, sorting and search. For a larger dataset, I would preferably implement these server-side together with pagination, and include the relevant parameters in the query/cache key.

### More robust error handling

The current error handling is intentionally shallow and mainly covers HTTP/query failures. A production implementation should distinguish between transport errors, invalid route parameters, not-found products, and successful responses containing invalid or unexpected data.

The Fake Store API can return a successful HTTP response for a nonexistent product, so HTTP status alone is not sufficient to determine whether the response represents a valid product.
