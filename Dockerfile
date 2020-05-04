FROM node:13 as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY src src/
COPY server server/
COPY public public/
COPY supervisord.conf .
RUN npm ci
RUN npm run build

FROM nginx:1.17-alpine
RUN apk add --update --no-cache supervisor
RUN apk add --update --no-cache nodejs npm
WORKDIR /app
COPY --from=builder ./app/build /usr/share/nginx/html
COPY --from=builder ./app/server server/
COPY --from=builder ./app/src src/
COPY --from=builder ./app/node_modules node_modules/
COPY --from=builder ./app/package.json .
COPY --from=builder ./app/supervisord.conf /etc/supervisord.conf

COPY default.conf.template /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
