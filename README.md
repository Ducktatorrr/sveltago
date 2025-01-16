# tagoio-svelte-starter

I've created this as a starter template for creating custom [TagoIO](https://tago.io/) widgets but but then with [Svelte](https://svelte.dev/docs/kit/creating-a-project)!

## What is it?

TagoIO is an IoT platform which at the time of writing "we" currently use for our IoT applications. They offer a range of built in widgets but also the option to create custom widgets which you can then import into a dashboard. The HTML/CSS/JS you then write is imported in an iFrame and enriched with TagoIO Widget information and IoT device data if selected.

Since I got the request to create some custom widgets I decided to build it using Svelte as I normally do when it comes to frontend stuff.

### Routing actually works

I used SvelteKit to initialise the project which might seem overkill but it's the fastest way to get starting and (bonus) I got routing working from within the custom widget. Normally this can be a bit of a pain since we're in an iFrame inside a TagoIO applicatio but this is solved by dynamically getting the base url of the hosted file. Check out `src/routes/+layout.svelte` where we leverage SvelteKit's built in `$app/paths` utilities to determine the base URL of which we want to navigate. So if you want to do some routing within the widget to show different pages this actually does work.

### Built with

- **Svelte 5 using SvelteKit**
- **Typescript**
- **TailwindCSS (just for some quick styling)**
- **TagoIO SDK (via CDN)**
- **My bare hands**

### Static files and hosting

As can be seen in `+layout.ts` we're prerendering the pages when building the widget. We're doing this to ensure that all content is statically generated at build time, making the widget fully compatible with TagoIO's hosting environment, which serves static files without server-side rendering support. This approach guarantees optimal performance and seamless integration within the iframe.

You can host the generate build wherever you want (for example S3 and serving via Cloudfront) but I recommend just uploading and hosting the built widgets in [TagoIO Files manager](https://help.tago.io/portal/en/kb/articles/127-files) themselves because that's also just S3 but abstracted away with an interface.

**DO NOTE:** Currently it's a bit of a pain to deploy the built application to TagoIO Files manager. See [Deploying](#deploying) for more info.

## Getting started

Before you start you will need to have npm (node package manager) installed... Feel free to pick your favorite package manager if you know what you're doing.

1. clone the repo

```bash
git clone https://github.com/Ducktatorrr/tagoio-svelte-starter
```

2. Install dependencies

```
cd tagoio-svelte-starter
npm i
```

Done!

## Developing

Once you've created a project and installed dependencies with `npm install` (or whatever package manager you use), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

As you can see in `src/routes/+page.svelte` we're checking to see if we're in our development environment and loading in some mock widget data that resembles what TagoIO sends down to the widget when it's loaded. This data will therefore not show when you deploy and open the widget on TagoIO.

You can now start developing your custom widget!

P.S. Feel free to remove the `src/routes/text` route and routing in `src/routes/+layout.svelte` as this is just for demonstrative purposes.

## Building

To create a production version of your app:

```bash
npm run build
```

Since we're using `@sveltejs/adapter-static` (see `svelte.config.js`) together with the `prerender = true` the production build will be placed in the `build/` folder.

You can preview the production build with `npm run preview`. It will currently not load any data in as it's not running the mockTagoIO function :).

## Deploying to TagoIO

**Attention:** I was going to create an automatic deployment script so that you can deploy the widget to TagoIO without manually having to upload files but there's currently a small bug in the file upload API preventing me from releasing that as of now. I hope to release this script soon:tm:.

Before we get started a small annoying thing: TagoIO Files manager doesn't currently support uploading whole folders so this deploying updates is currently a bit tedious.

1. Create some new folders exactly like the structure in your build folder. You can name the root folder whatever you like. You should get a structure like this:

```bash
custom-widget_name/
└── _app/
    └── immutable/
        ├── assets/
        ├── chunks/
        ├── entry/
        └── nodes/
```

2. Upload the files into the correct folders. Check your build folder to see what files go where and upload them into the correct places accordingly. You should end up with something like this:

```bash
build
├── _app
│   ├── env.js
│   ├── immutable
│   │   ├── assets
│   │   │   ├── 0.CzGQM0bN.css
│   │   │   └── _layout.CzGQM0bN.css
│   │   ├── chunks
│   │   │   ├── disclose-version.CEwVefj8.js
│   │   │   ├── entry.vp00TPl9.js
│   │   │   ├── if.Bymjzpus.js
│   │   │   ├── index-client.C_FfYLxq.js
│   │   │   ├── index.DH_PEu1t.js
│   │   │   ├── legacy.BxHchiDq.js
│   │   │   ├── render.BhifmYzZ.js
│   │   │   └── runtime.BISgHtAn.js
│   │   ├── entry
│   │   │   ├── app.dIciKfj9.js
│   │   │   └── start.DO-0-Ocx.js
│   │   └── nodes
│   │       ├── 0.DzwgEgyI.js
│   │       ├── 1.BowV69VK.js
│   │       ├── 2.CfRK1IOV.js
│   │       └── 3.COGp8xry.js
│   └── version.json
├── favicon.png # Don't necessarily have to upload this one ;)
├── index.html
└── test.html
```

Before continuing make sure the file status is public otherwise your custom widget code is not available.

3. In your TagoIO Files manager at the root of your custom widget folder copy the file URL of `index.html`

4. Go into any dashboard you like, add a new widget and select **Custom**.

5. At URL and Parameters paste the file URL

6. Select a device (or blueprint device) and a variable you want to load in and press create.

Your widget should now be visible!

You can use the debug buttons **Log widget data** and **Log real-time data** to view what's being loaded into the widget in the console logs.
