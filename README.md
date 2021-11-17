# sushi-om
Sushi order manager project that permit the order of sushi plates between people in the same table/group

In order to build it in docker using docker-compose you need to set those environment variables inside a .env file:

SITE_URL: the url in which you are exposing the frontend and the backend

FRONTEND_PORT: the frontend port

BACKEND_PORT: the backend port
JWT_SECRET: the backend jwt secret
JWT_EXPIRATION: the jwt expiration

PGUSER: the postgres user used by the backend
PGPASSWORD: the postgres user's password used by the backend
PGDATABASE: the postgres database used by the backend
