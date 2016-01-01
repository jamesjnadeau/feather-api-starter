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

The api is started from `bin/www` and is a basic express app with [feathers](http://feathersjs.com/)
and [mongoose](https://github.com/feathersjs/feathers-mongoose),
added on top of it to hasten api dev. The api site handles all the saving, updating,
and administrative features for the sites. The front end is essentially a statically
generated html site being served from `frontend/built/`. A staging version of the site
that allows editing of pages, will be made available for authorized users to preview
changes before pushing live. When all is considered ok to be pushed live, the
site is synced to s3 via a interface accessible to admins from the api's site.

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
1. [localhost:8080 Api Site](http://localhost:8080)
1. [localhost:8081 Fronted Site](http://localhost:8081)
1. [localhost:8082 Staging Site](http://localhost:8081)
1. [localhost:8000 Kue UI ](http://localhost:8000) - used to see background processing jobs(s3 sync for example).
1. Keep in mind, CORS is key, take a loot at `api/config/initializers/##-corser` to debug
any issues you might have made for yourself.
1. `node_modules/_local` contains code that is used in both the api and the frontend
generation. Things like models, the static content loader, and shared frontend code.

## Design Goals

I'd like to use the 18f standards as a starting point: https://playbook.cio.gov/designstandards/

This site needs a brand. Then it needs a content strategy.... Not sure if
this is the designers responsibility, but will play a big role in what they produce.

Possible deliverables():
- [ ] Landing(home) Page layout
- [ ] Donation and Payment forms
- [ ] Promotion page layouts - perhaps 2
- [ ] Email template(s) - A general template for sending info, another that begs for money. Seasonal offerings if time allows (xmas, veterans day, memorial day, July 4th)
- [ ] Team pages - Used for teams(companies/schools) to get information about their orgs fund raising drive.
- [ ] Event page - Sign up and advertising landing pages for various events they do throughout the year - need more info from client about this.
- [ ] News/blog items/pages - Basic text articles with hero videos/images. Goes along with content  stategy.
- [ ] Fliers and print-outs for teams to advertise fundraising events. A design that looks good without color will go a long way here. (most companies print in B&W to save $ on ink)
