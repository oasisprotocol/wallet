FROM docker.io/library/golang:1.16 AS build-env
WORKDIR /app

ARG COMMIT="28332c0b3d3becceee113817471d53d42f2c1dc3"

# Fetch and build oasis-core-rosetta-gateway.
RUN git clone https://github.com/everstake/oasis-explorer.git /app &&  \
    git checkout $COMMIT

ENV CGO_ENABLED 0
RUN go build

FROM docker.io/library/alpine:3.14.0
RUN apk add --no-cache ca-certificates
COPY --from=build-env /app/oasisTracker /oasisTracker
COPY --from=build-env app/dao/postgres/migrations /dao/postgres/migrations
COPY --from=build-env app/dao/clickhouse/migrations /dao/clickhouse/migrations

CMD ["/oasisTracker"]
