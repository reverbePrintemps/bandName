# BandName!

## tl;dr

The `BandName!` app is currently published at: https://bandname.app

## About

Ever stopped mid-sentence because something you just said sounds **absolutely ridiculous**, when out of context?

That's when you take a moment to shout — or whisper — `BandName!`, before carrying on with the rest of your prose.

After years of trying to have a centralized database of `BandName!`s and a Google Spreadsheet, a messaging app thread or even a personal notes app weren't cutting it, I've decided to take on the challenge and create an app where anyone, anywhere, can share their `BandName!`s with the world.

## Stack

### Design

A blend of custom CSS ([BEM convention](https://en.bem.info/methodology/css/)) with some [Material UI](https://mui.com/) Components and Icons and Google Fonts. No CSS preprocessors nor CSS-IN-JS (yet?) although [Stitches](https://stitches.dev/) and [Emotion](https://emotion.sh/docs/@emotion/css) have piqued my interest.

### Frontend

I had started the project as a [Next.js](https://nextjs.org/) app to learn more about SSR (Server Side Rendering) and ISR (Incremental Static Regeneration) - essentially SSR + hydration - but the Vercel deploy was giving me [the dreaded 504 error](https://stackoverflow.com/questions/68771480/nextjs-vercel-504-error-function-invocation-timeout). Not wanting to upgrade to a paid plan for an app that so far has only 4 users, I decided to start over again with the familiar, tried, tested and loved [create-react-app](https://create-react-app.dev/) + typescript combo. ❤️

### Backend

[Firestore](https://firebase.google.com/docs/firestore/) 🔥

### Testing

Currently TBD

Cypress? RTL? Jest? Something else? We'll cross that bridge when we get there. (soon enough...)

### Hosting

Despite GitHub Pages infamous notoriety (infamy?) with SPAs (Single Page Apps) and React Router — had to use [this icky but lightweight solution](https://github.com/rafgraph/spa-github-pages) to solve the 404 issue on fresh page load - I've still decided to use it because it's simple, works well (despite the aformentioned shenanigans) and lives right beside the code itself.

## What‘s next?

The BandName app is a playground for me to learn new technologies, practice designing and implementing things, test experimental stuff and iterate over a React/Typescript app while emulating a real world scenario of (almost) daily value creation and code deployment.

On top of the existing features, some things I'd like to introduce next are:

- Sort by latest or most popular
- Other login methods
- Dark mode (I know...)
- Genre suggestiongs on type
- Offline mode
- Native push notifications (Firebase Cloud Messaging?)
- Add more sharing channels (Signal, Twitter...)
- NSFW mode
- Lazy load components to reduce bundle size
- Analytics (maybe...)
- Emoji reactions?

More broadly, I'd like to:

- Turn the app completely into a PWA (Progressive Web App)
- Make the app fully accessible
- Optimize the frontend and firestore code
- Increase security on the app
- Above all, make it fun and engaging :)
