FROM golang:1.16 AS build-env
WORKDIR /app

ARG CB=1234567
ARG BRANCH="balance-and-startheight"

# Fetch and build oasis-core-rosetta-gateway.
RUN git clone --single-branch --branch $BRANCH https://github.com/esya/oasis-explorer.git /app &&  \ 
    cd /app

ENV CGO_ENABLED 0
RUN go build

FROM alpine:latest
RUN apk add ca-certificates
COPY --from=build-env /app/oasisTracker /oasisTracker
# COPY --from=build-env /app/oasisTracker /
# COPY --from=build-env /app/.secrets /
# COPY --from=build-env /app/genesis.json /
COPY --from=build-env app/dao/postgres/migrations /dao/postgres/migrations
COPY --from=build-env app/dao/clickhouse/migrations /dao/clickhouse/migrations

CMD ["/oasisTracker"]
