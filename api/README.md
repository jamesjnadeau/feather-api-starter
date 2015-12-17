# API
## Environment vars
| Name  | (Default) Description  |
|---|---|
| API_PORT  | (8080) The port on which to listen for connections  |
| ENV  | (development) The environment in which we are running  |
| REDIS_HOST  | ('localhost') a string with the host of our reids service  |
| REDIS_PORT  | ('27017') a string with the port of our reids service  |
| REDIS_MAXAGE  | ('24 * 60 * 60 * 1000') the max age of a record  |
| REDIS_PREFIX  | ('project-name') the name of the redis prefix used |
| MONGO_URI  | (mongodb://localhost/{packageName}) the db to connect to.  |
| ALLOWED_ORIGINS  | (http://localhost:8081) The CORS origins allowed, see corser package and initializer  |
