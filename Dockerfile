FROM rust:1.30.1

RUN rustup toolchain install nightly &&  \
    rustup target add wasm32-unknown-unknown --toolchain nightly && \
    cargo +nightly install wasm-bindgen-cli

VOLUME ["/src"]
WORKDIR /src
