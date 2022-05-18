# Currently broken

- Weird behavior with country select on blur/focus
- Country selector not submitting country on post submit
- Rerenders entire Feed on load more (refreshes to top of page, might be due to rendering spinner? render spinner more locally instead)
- Hearts

# TODO

- [] Copy Metatags from other project see if it helps with social media sharing image preview
- [] Optimize design for mobile
- [] Replace country input with custom filter input from typing to flags
- [] Reintroduce hearts
- [] Unify Feeds (?)
- [] Get rid of /enter route
- [] Show spinner where relevant (loading page, uploading new post)
- [] Suggest existing genres on typing
- [] Introduce field validation for genre and country as well
- [] Create routes to check all posts of same genre or same country
- [] Introduce clapping instead of hearts
- [] Update feed in realtime instead of brute refresh upon post upload
- [] Address TODOs
- [] Introduce ability to delete
- [] Remove unused routes/pages
- [] BEM the shit out of everything
- [] Demolish CSS defaults
- [] Spinner not showing on main feed
- [] Check for existence of band name on input field change (debounce?)
- [] Introduce push notification on new post created (PWA?)
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

# DONE

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
