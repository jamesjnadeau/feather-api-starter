# API
## Environment vars - these are used everywhere
| Name  | (Default) Description  |
|---|---|
| COOKIE_DOMAIN  | (.localhost) the domain used in session cookies, should probably have a . in front to ensure it's matches all sub-domains  |
| API_URL  | () The url the api will be available on, this needs to be set |
| API_PORT  | (8080) The port on which to listen for connections  |
| STAGING_PORT  | (8082) the port the staging server for development runs on.  |
| FRONTEND_PORT  | (8081) the port the frontend dev server runs on  |
| NODE_ENV  | (development) The environment in which we are running  |
| REDIS_HOST  | ('localhost') a string with the host of our reids service  |
| REDIS_PORT  | ('27017') a string with the port of our reids service  |
| REDIS_MAXAGE  | ('24 * 60 * 60 * 1000') the max age of a record  |
| REDIS_PREFIX  | ('project-name') the name of the redis prefix used |
| MONGO_URI  | (mongodb://localhost/{packageName}) the db to connect to.  |
| ALLOWED_ORIGINS  | (http://localhost:8081~http://localhost:8082) The CORS origins allowed, see corser package and initializer, should contain the staging and frontend urls. Note the use of the tilde char ~ to seperate multiple origins.   |
| KUE_PORT  | () Setting this will run the kue UI/app on the specified port, not setting this does not start the app.  |
|   |   |
|   |   |
