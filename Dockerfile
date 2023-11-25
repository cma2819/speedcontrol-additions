# Install nodecg-speedcontrol
FROM node:18-alpine AS nodecg_speedcontrol

WORKDIR /app

RUN apk --no-cache add git
RUN git clone https://github.com/speedcontrol/nodecg-speedcontrol
RUN npm --prefix /app/nodecg-speedcontrol install &&\
    npm --prefix /app/nodecg-speedcontrol run build

FROM ghcr.io/nodecg/nodecg:latest

USER nodecg

COPY --chown=nodecg:nodecg --from=nodecg_speedcontrol /app/nodecg-speedcontrol /opt/nodecg/bundles/nodecg-speedcontrol
RUN nodecg defaultconfig nodecg-speedcontrol

COPY --chown=nodecg:nodecg ./dashboard /opt/nodecg/bundles/speedcontrol-additions/dashboard
COPY --chown=nodecg:nodecg ./extension /opt/nodecg/bundles/speedcontrol-additions/extension
