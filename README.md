# Platypus Travel Co. — design preview

Open index.html in a browser, or use the active local preview at http://127.0.0.1:8765/.

Three pages: Home, Product, About. Price $59 USD. Temporary wordmark pending logo. Actual product photos power both 72-frame spins; drag, arrow buttons and keyboard arrows are supported.

Bag and checkout are demonstrations only. No Shopify writes, orders, payments, or publication. The approved lifestyle image and Google Fonts require internet access.

Verified: desktop and 390px mobile layouts, no horizontal overflow on tested product and About pages, product form switching and arrow rotation, quantity 2 subtotal $118, removal, checkout demonstration message, no browser console errors observed.

For review: page design, section order, copy adaptations and mobile layout. Before launch: official logo, final price confirmation, specifications, inventory, shipping and support details, policy completion and Shopify integration. Rejected smiling image is excluded.

## Publishing the preview on GitHub Pages

This is a plain static site (HTML, CSS, JS and image assets, all referenced with relative paths), so it can be served directly by GitHub Pages — no build step is required.

`.github/workflows/deploy-pages.yml` publishes every push to `main`. It copies the site files into `_site` (excluding `.git` and `.github`), adds `.nojekyll` so directories are served as-is, and deploys through the official GitHub Pages actions.

Two settings have to be in place on the repository before the first deployment succeeds, and both are manual:

1. **Pages must be available.** GitHub Pages only serves private repositories on paid organization plans. If the organization is on the free plan, make this repository public first (Settings → General → Danger Zone → Change visibility).
2. **Pages must be turned on with "GitHub Actions" as the source** (Settings → Pages → Build and deployment → Source). The workflow asks for this through `enablement: true`, but the token available to a workflow run is not allowed to create the Pages site — the first run failed with `Create Pages site failed. Error: Resource not accessible by integration`. Once Pages exists, that step becomes a no-op and later pushes deploy on their own.

After turning Pages on, re-run the latest workflow run (Actions → Deploy preview to GitHub Pages → Re-run jobs), or push any commit to `main`.

Once deployed, the preview is at `https://estesmedia2022.github.io/platypus-travel-site-preview/`.

Note that the pages carry `noindex,nofollow`, so search engines are asked not to list the preview, but anyone with the URL can open it. If the preview needs to stay genuinely restricted, host it behind a password instead (for example Netlify or Cloudflare Pages with access protection).
