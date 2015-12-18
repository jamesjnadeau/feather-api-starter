# G.I. Go Fund .org - [gigofund.org](http://gigofund.org)

This site serves as a fundraising and rally point for a large non-profit organization
that helps support American Vetrans. Originally based out of NJ, it has grown to be a
nation wide fundraising organization. It's jean for troops teams generate substantial
revenue in quick bursts through timely marketing campaings and fundraising drives.
The ability to handle large amounts of traffic quickly and smoothly is very important
to the client. Any downtime or slowness is $$$$ lost.

The Architecture used here is somewhat complex, and maybe I'll hate myself later for
using it, but I really think it's the best for this situation and will allow for unlimited
scaling when needed with little effort needed on our end.

## Architecture Overview

There are 2 "websites" built into this systems architecture to allow it to handle
large loads, and allow it to be worked on and managed by it's end users. A built in
staging system allows edits to be tested and made before the staging site is pushed live.
All of this is controlled, and calls are made to the a backend api site that.

The api is started from `api/bin/www` and is a basic express app with [feathers](http://feathersjs.com/)
and [mongoose](https://github.com/feathersjs/feathers-mongoose),
added on top of it to hasten api dev. From here, any calls to the frontend are handled,
and changes could be pushed to the staging site, being served from `frontend/built/`.
When all is considered ok to be pushed live, the site is synced to s3 via a
interface accessible to admins from the api's site.

A single webpack.config.js file runs all the frontend site generation, from html,
to css, and of course js. This allows all the sites to have auto page reloading
when in a dev environrment. When in produciton, code is minimized, and split/chunked
as necesssary. Note that there are 2 packs used, and when in dev mode webpack is not
run from the command line unless you need to build for production or reload
the webpack.config.js file and test changes to that.

I've decided to start by just implementing [jquery-ui themed widgets]( https://jqueryui.com/widget/)
to not get too crazy with the frontend before it's necessary. In my experience it's enough.
We're not building Gmail here, I think after a quick initial run, this project will move
to streamlining the admin workflows and automating processes and retention strategies.

## Development

Make sure you have redis/mongo running and ready on standard ports. Set up `npm completion` too!

Get the dependencies: `npm install --dev`

Copy example.env to .env `cp env.example .env`

Edit to your liking, see the readme in the api folder for a full listing.

start dev environment: `npm run dev`

stop dev environment: `npm run dev:stop`

This will start up the api at the ports you set it to, and open your browser to
a webpack-dev-server instance. Any changes made to frontend code will trigger a
rebuild and page refresh for you. Here's a quick list of tips:

1. The default setup should work, take a look at `npm run` as try to put useful
 commands there as you come by them
1. [localhost:8080 Default Api Site](http://localhost:8080)
1. [localhost:8000 Kue UI - used to see background processing jobs.](http://localhost:8000)
1. Keep in mind, CORS is keep, take a loot at `api/config/initializers/##-corser` to debug
any issues you might have made for yourself.
1. `node_modules/_local` contains code that is used in both the api and the frontend
generation. Things like models, the static content loader, and shared frontend code.

## Design Goals
