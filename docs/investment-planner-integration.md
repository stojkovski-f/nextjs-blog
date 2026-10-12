# Investment planner integration

The route `/[locale]/investment-planner` renders an empty mount node:

```html
<div id="investment-planner-root"></div>
```

## Options

1. **Client component** — Import your existing React app and render it inside `#investment-planner-root` from a `"use client"` wrapper in `app/[locale]/investment-planner/page.tsx` or a child component.
2. **iframe** — Host the planner on another origin and embed it in the mount div.
3. **npm package** — Publish the planner as a package, install it in this repo, and mount its root component on this page.

Keep planner-specific state client-side. Add analytics or cookies only after updating the privacy page copy in `messages/sv.json` and `messages/en.json`.
