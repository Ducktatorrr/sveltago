# Sveltago

A starter template for creating custom [TagoIO](https://tago.io/) widgets using [Svelte](https://svelte.dev/)!

## What’s this about?

[TagoIO](https://tago.io/) is an IoT platform that lets you build dashboards and widgets with real device data. You can build your own custom widgets, which TagoIO then loads in an iframe and injects data into.

I love Svelte for frontend work, so I cooked up this starter template to make life easier when building custom widgets.

### Why SvelteKit?

I used SvelteKit because:

- It’s quick to set up.
- Routing just works—even inside an iframe, thanks to some dynamic base path logic in `src/routes/+layout.svelte` (shoutout to SvelteKit’s `$app/paths`).

### Tech stack

- **Svelte 5** with SvelteKit
- **TypeScript**
- **TailwindCSS** (for quick styling)
- **TagoIO SDK (via CDN)**
- **My bare hands** (and presumably yours)

### Static files + hosting

We use `@sveltejs/adapter-static` and `prerender` to generate static files. This makes the widget fully compatible with TagoIO’s hosting setup (which doesn’t do server-side rendering).

You can host the build anywhere (S3, Cloudfront, etc.), but uploading it directly to the [TagoIO Files Manager](https://help.tago.io/portal/en/kb/articles/127-files) is easiest—just note that you currently can’t upload entire folders at once.

## Getting started

1. **Clone** this repo:

   ```bash
   git clone https://github.com/Ducktatorrr/tagoio-svelte-starter
   ```

2. **Install dependencies**:

   ```bash
   cd tagoio-svelte-starter
   npm i
   ```

That’s it—you’re good to go.

## Developing

Run a local dev server:

```bash
npm run dev

# Or open in a new tab:
npm run dev -- --open
```

In `src/routes/+page.svelte`, there’s a check to see if you’re running locally. If so, it loads mock widget data that mimics what TagoIO sends. (You won’t see this data in production.)

Feel free to remove the sample `src/routes/text` route and its references in `+layout.svelte` if you don’t need it.

## Building

Build a production version:

```bash
npm run build
```

This creates a `build/` folder full of static files. You can test it locally (without the mock data) by running:

```bash
npm run preview
```

## Deploying to TagoIO

### Manual upload (for now)

There’s a current bug in TagoIO’s file upload API, so we can’t automate this just yet. Here’s the manual approach:

1. In TagoIO’s **Files Manager**, create folders to mirror your build folder structure (like `_app/immutable/assets/`, etc.).
2. **Upload** the files from `build/` into each matching folder. Make sure they’re set to **Public**.
3. Grab the **URL** of `index.html` in your custom widget folder.
4. In your TagoIO dashboard, **add a new widget** and select **Custom**.
5. Paste the URL and any parameters, select your device/variable, and create the widget.
6. Enjoy your new Svelte-powered TagoIO custom widget!

Use the “Log widget data” and “Log real-time data” debug buttons in TagoIO to see what’s being passed into your widget.
