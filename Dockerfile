FROM rust:1.30.1

RUN rustup target add wasm32-unknown-unknown

VOLUME ["/src"]
WORKDIR /src
