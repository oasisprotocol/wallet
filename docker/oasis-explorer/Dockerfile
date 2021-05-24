FROM docker.io/library/golang:1.16 AS build-env
WORKDIR /app

ARG COMMIT="ce1eb145161a52b85a0db6df470392e155a2129d"

# Fetch and build oasis-core-rosetta-gateway.
RUN git clone https://github.com/everstake/oasis-explorer.git /app &&  \
    git checkout $COMMIT

ENV CGO_ENABLED 0
RUN go build

FROM docker.io/library/alpine:3.13.5
RUN apk add --no-cache ca-certificates
COPY --from=build-env /app/oasisTracker /oasisTracker
COPY --from=build-env app/dao/postgres/migrations /dao/postgres/migrations
COPY --from=build-env app/dao/clickhouse/migrations /dao/clickhouse/migrations

CMD ["/oasisTracker"]
