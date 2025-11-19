FROM node:20-alpine

WORKDIR /app

RUN addgroup -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

COPY package.json ./

RUN npm install && \
    npm cache clean --force

COPY --chown=nodejs:nodejs . .

RUN apk add --no-cache python3 make g++ && \
    npm install -g http-server && \
    apk del python3 make g++

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["http-server", "-p", "8080", "-c-1"]