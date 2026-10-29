FROM node:22.22.0-alpine@sha256:e4bf2a82ad0a4037d28035ae71529873c069b13eb0455466ae0bc13363826e34
RUN apk add --no-cache chromium
RUN apk add --no-cache font-noto-cjk
RUN apk add --no-cache chromium-swiftshader
WORKDIR /checks
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY *.mjs ./
ENV BASE_URL=http://localhost:3000 OUTPUT_DIR=/evidence CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENTRYPOINT ["node"]
CMD ["measure.mjs"]
