# Currently broken

- Fix user feed showing other's posts (and footer) (might be worth just unifying feeds)
- Rendering feed footer instead of load more although there are more posts to load
- Rerenders entire Feed on load more (refreshes to top of page, might be due to rendering spinner? render spinner more locally instead)

# TODO

- [] Implement username choosing (redirect to separate route if no username?)
- [] Introduce ability to delete
- [] Introduce ability to edit
- [] Introduce clapping animation on clap (inspiration: medium.com)
- [] Rename heart concept to clap
- [] Debounce (?) clapping update behavior
- [] Dark mode
- [] Link to posts with similar countries
- [] Unify Feeds (?)
- [] Show spinner where relevant (loading page, uploading new post)
- [] Suggest existing genres on typing
  - [] Link to posts with similar genres
- [] Introduce field validation for genre and country as well
- [] Introduce clapping instead of hearts
- [] Update feed in realtime instead of brute refresh upon post upload
- [] Address TODOs
- [] Remove unused routes/pages
- [] BEM the shit out of everything
- [] Demolish CSS defaults
- [] Spinner not showing on main feed
- [] Check for existence of band name on input field change (debounce?)
- [] Introduce push notification on new post created (PWA? Firebase Cloud Messaging?)
- [] Update meta information
- [] Test sharing (Twitter card validator)
- [] Install CSS classname usage plugin and run it
- [] Add tooltip to country flag
- [] Get rid of concept of slug?
- [] Undo Firebase hosting
- [] Check out realtime subscription stuff in hooks.ts
- [] Unify buttons
- [] Add "Posted on" date to posts
- [] Clean up unused packages
- [] Swap default exports/imports to named exports/imports
- [] Smaller nav bar (no need for profile image in nav bar?)
- [] Run npm run deploy on git push
- [] Write JSDocs
- [] React lazy + suspense to lazy load components to improve performance :)
- [] Create custom hooks to simplify code (cf. https://youtu.be/b0IZo2Aho9Y?t=502)

# DONE

- [x] Reintroduce hearts
- [x] Replace country input with custom filter input from typing to flags
- [x] Optimize design for mobile
- [x] Copy Metatags from other project see if it helps with social media sharing image preview
- [x] Complete list of country flags
- [x] Publish to GH Pages (and pray that it works)
- [x] Show 404 on /username that doesn't exist
- [x] What happened to load more button?
- [x] Fix hot reload
- [x] Create new simple React project, no SSR bullshit
- [x] Fix fucking no-unused-vars and deploy
- [x] Stylesheet not applying to PostFeed
- [x] Load only own posts on load more on /username
- [x] Show UserProfile component if logged in user is on own page
- [x] Feed appears to anonymous users
- [x] Figure out shit with images (avatar and google sign in logo)
- [x] Bug: Other's posts appearing under my username
- [x] Delete concept of post content
- [x] Remove concept of published. i.e. always publish
- [x] Introduce concept of genre
- [x] Introduce country?
- [x] What is the "api" page and its hello.js file?
