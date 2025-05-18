# Minispace Development Rules

## Core Principles

1. **Performance First**: Always prioritize performance over feature richness. Every line of code added must justify its weight.

2. **Incremental Development**: Add features incrementally, measuring performance at each step.

3. **Markdown-Centric**: All content must be markdown-based to ensure simplicity, portability, and performance.

4. **User Experience Focus**: Features should enhance, not complicate, the user experience.

## Technical Rules

1. **Strict Performance Budgets**
    - Page weight: Max 50KB per blog post (target: 15KB)
    - Time to First Byte: < 100ms
    - First Contentful Paint: < 800ms
    - Must pass all Core Web Vitals
    - Lighthouse score minimum: 95+ in all categories

2. **Code Quality**
    - No feature branches without performance tests
    - All new code must include performance benchmarks
    - Critical rendering path must remain unblocked

3. **Asset Optimization**
    - Images must be automatically optimized and served in modern formats
    - CSS must be critical-path inlined or deferred appropriately
    - JavaScript must be minimal, modular, and loaded only when needed

4. **Feature Implementation**
    - Features must be implemented in priority order
    - Each feature must have a clear performance budget
    - Non-essential features must be lazy-loaded
    - Editor features must not impact reader performance

5. **Testing Requirements**
    - Each PR must include performance comparison with Bear Blog
    - Regular testing on low-end devices and slow connections
    - A/B testing for features that might impact performance

## Development Phases

1. **Foundation Phase**: Core blogging platform with minimal viable features
2. **Enhancement Phase**: Adding customization and improved editor experience
3. **Extension Phase**: Analytics, multiple content types, and community features
4. **Refinement Phase**: Mobile optimization and developer extensibility

## Measurement & Accountability

- Weekly performance audits against Bear Blog
- Performance regression testing for each PR
- User experience metrics alongside technical performance
- Public performance dashboard for transparency

Remember: If you can't measure it, you can't improve it. When in doubt, choose the simpler, faster solution.

----

For optimal performance, create a minimal CSS approach using system fonts and efficient styling.

- Do not go above these instructions. Make sure you use best practices, when in doubt, read the next js documentation, stack overflow or css articles.

- No page should have lines of code above 250 lines. Break code down into smaller components when the lines will max 250 lines.

- No unfinished codes, use minimal javascript and only when needed. Add proper error handling.



----


- Do not go above these instructions. Make sure you use best practices, when in doubt, read the next js documentation, stack overflow or tailwind css articles.

- No page should have lines of code above 250 lines. Break code down into smaller components when the lines will max 250 lines.

- No unfinished codes, use minimal javascript and only when needed. Add proper error handling. 

- Be sure to use the components in #ui folder, if any of the components you use will be reused, make sure to create a component for it under the #ui folder


---
after which we will design our first theme, the minimal theme, adding blocks should be optional, if the user is okay with what the theme has theremight be no need to add block just to edit or add content in markdown.