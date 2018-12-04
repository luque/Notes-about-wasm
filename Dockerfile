FROM rust:1.30.1

RUN rustup toolchain install nightly &&  \
    rustup target add wasm32-unknown-unknown && \
    cargo +nightly install wasm-bindgen-cli && \
    cargo install cargo-web && 		    \
    cargo install cargo-generate && \
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh 

VOLUME ["/src"]
WORKDIR /src
