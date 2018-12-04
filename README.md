# Personal Study Notes about WebAssembly

## What is WebAssembly?

From the WebAssembly home page:

> WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable target for compilation of high-level languages like C/C++/Rust, enabling deployment on the web for client and server applications.

WebAssembly is a portable binary instruction format. The operations encoded in a WebAssembly
module are not tightly coupled to any one hardware architecture or operating
system, and these operations are just codes that a parser knows how to
interpret.

The phrase “...deployment on the web...” might limit your thinking and your
imagination. This is a portable format that can run anywhere you can build
a host, which you’ll also be learning about later. Limiting WebAssembly’s
scope to the web (despite its name) does it a disservice.

WebAssembly Studio: https://webassembly.studio/

Try an Empty Rust example with WebAssembly Studio.

## Architecture

WebAssembly does not follow a "register machine" architecture like most of our computers.

WebAssembly is a Stack Machine. In a stack machine, most of the instructions
assume that the operands are sitting on the stack, rather than stored in
specified registers. The WebAssembly stack is a LIFO (Last In First Out) stack.

WebAssembly 1.0 has exactly four data types:
- i32 32-Bit Integer
- i64 64-Bit Integer
- f32 32-Bit Floating Point Number
- f64 64-Bit Floating Point Number

WebAssembly has the following control flow instructions available:
- if Marks the beginning of an if branching instruction.
- else Marks the else block of an if instruction
- loop A labeled block used to create loops
- block A sequence of instructions, often used within expressions
- br Branch to the given label in a containing instruction or block
- br_if Identical to a branch, but with a prerequisite condition
- br_table Branches, but instead of to a label it jumps to a function index in a table
- return Returns a value from the instruction (1.0 only supports 1 return value)
- end Marks the end of a block, loop, if, or a function
- nop No self-respecting assembly language is without an operation that does nothing

WebAssembly doesn’t have a heap in the traditional sense. There’s no concept
of a new operator. In fact, you don’t allocate memory at the object level because
there are no objects. There’s also no garbage collection (at least not in the 1.0
MVP).

Instead, WebAssembly has linear memory. This is a contiguous block of bytes
that can be declared internally within the module, exported out of a module,
or imported from the host. Think of it as though the code you’re writing is
restricted to using a single variable that is a byte array. Your WebAssembly
module can grow the lineary memory block in increments called pages of
64KB if it needs more space. Sadly, determining if you need more space is
entirely up to you and your code—there’s no runtime to do this for you.

In addition to the efficiency of direct memory access, there’s another reason
why it’s ideal for WebAssembly: security. While the host can read and write
any linear memory given to a wasm module at any time, the wasm module
can never access any of the host’s memory.

## Building a WebAssembly application

Install the WebAssembly Binary Toolkit (WABT, pronounced "wabbit"): 
https://github.com/WebAssembly/wabt

Example Add:

```
(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add)
  (export "add" (func $add))
)
```

## Building WebAssembly Checkers

See checkers code at sources/checkers directory.

## Introducing Rust

Rust started in 2006 as Graydon Hoare’s personal project while he was
working for Mozilla. Mozilla sponsored it in 2009 and announced it in 2010.

> Rust is a systems programming language that runs blazingly fast, prevents seg-
faults, and guarantees thread safety.

### Install rustup:

$ rustc --version
rustc 1.30.1 (1433507eb 2018-11-07)

### Install the WebAssembly target for Ruth:

$ rustup target add wasm32-unknown-unknown
$ rustup target list

### Creating a WebAssembly project:

$ cargo new --lib rustwasmhello

$ cargo new --lib rustycheckers


## Integrating WebAssembly with JavaScript

wasm-bindgen:

wasm-bindgen injects a bunch of metadata into your compiled
WebAssembly module. Then, a separate command-line tool reads that meta-
data, strips it out, and uses that information to generate an appropriate
JavaScript "wrapper bridge" containing the kinds of functions, classes, and
other primitives that the developer wants bound to Rust.


Example bindgenhello:

$ npm install
$ npm run build-release --> See package.json
$ npm run serve

Open http://localhost:8080


### Rogue WebAssembly game

Example in rogue directory:

$ npm install
$ npm run build-release --> See package.json
$ npm run serve

Open http://localhost:8080

## Advanced JavaScript integration with Yew


Yew (pronounced /juː/, the same way as "you") is a modern Rust framework inspired by Elm and ReactJS for creating multi-threaded frontend apps with WebAssembly.

The framework supports multi-threading & concurrency out of the box. It uses Web Workers API to spawn actors (agents) in separate threads and uses a local scheduler attached to a thread for concurrent tasks.

Project at GitHub: https://github.com/DenisKolodin/yew


## Rust and WebAssembly Tutorial (Game of Life)


```$ cargo generate --git https://github.com/rustwasm/wasm-pack-template -n wasm-game-of-life
wasm-game-of-life $ wasm-pack build
wasm-game-of-life $ npm init wasm-app www
```

This package.json comes pre-configured with webpack and webpack-dev-server dependencies, as well as a dependency on hello-wasm-pack, which is a version of the initial wasm-pack-template package that has been published to npm.

```
wasm-game-of-life/www $ npm install
```

### Using our local wasm-game-of-life package in www:

Rather than use the hello-wasm-pack package from npm, we want to use our local wasm-game-of-life package instead. This will allow us to incrementally develop our Game of Life program.

First, run npm link inside the wasm-game-of-life/pkg directory, so that the local package can be depended upon by other local packages without publishing them to npm:

```
npm link
```

Second, use the npm linked version of the wasm-game-of-life from the www package by running this command within wasm-game-of-life/www:

```
npm link wasm-game-of-life
```

Finally, modify wasm-game-of-life/www/index.js to import wasm-game-of-life instead of the hello-wasm-pack package:

```
import * as wasm from "wasm-game-of-life";

wasm.greet();
```

The problem in NixOS is that the nodejs global directory is a read-only file system. Workaround:


It is possible to make a workaround for this by having a custom prefix inside ~/.npmrc. So if you create ~/.npmrc with content:

```
  prefix=~/.npm
```

Next time your run npm link or npm install -g, it would use ~/.npm as root folder.

### Serving locally

```
www $ npm run start
```

Anytime you make changes and want them reflected on http://localhost:8080/, just re-run the wasm-pack build command within the wasm-game-of-life directory.


### Implementing Life

#### Designing the interface between Rust and JavaScript

As a general rule of thumb, a good JavaScript<->WebAssembly interface design is often one where large, long-lived data structures are implemented as Rust types that live in the WebAssembly linear memory, and are exposed to JavaScript as opaque handles. JavaScript calls exported WebAssembly functions that take these opaque handles, transform their data, perform heavy computations, query the data, and ultimately return a small, copy-able result. By only returning the small result of the computation, we avoid copying and/or serializing everything back and forth between the JavaScript garbage-collected heap and the WebAssembly linear memory.

We can represent the universe as a flat array that lives in the WebAssembly linear memory, and has a byte for each cell. 0 is a dead cell and 1 is a live cell.

To find the array index of the cell at a given row and column in the universe, we can use this formula:

```index(row, column, universe) = row * width(universe) + column```

We have several ways of exposing the universe's cells to JavaScript. To begin, we will implement std::fmt::Display for Universe, which we can use to generate a Rust String of the cells rendered as text characters. This Rust String is then copied from the WebAssembly linear memory into a JavaScript String in the JavaScript's garbage-collected heap, and is then displayed by setting HTML textContent. Later in the chapter, we'll evolve this implementation to avoid copying the universe's cells between heaps and to render to <canvas>.

#### Rust implementation

See at `sources/wasm-game-of-life/src/lib.rs`.

#### Rendering with JavaScript

#### Rendering to Canvas Directly from Memory

Generating (and allocating) a String in Rust and then having wasm-bindgen convert it to a valid JavaScript string makes unnecessary copies of the universe's cells. As the JavaScript code already knows the width and height of the universe, and can read WebAssembly's linear memory that make up the cells directly, we'll modify the render method to return a pointer to the start of the cells array.

By working with pointers and overlays, we avoid copying the cells across the boundary on every tick.



## References

- WebAssembly site: https://webassembly.org/
- Yew Rust framework for building client web apps: https://github.com/DenisKolodin/yew
- Awesome WebAssembly: https://github.com/mbasso/awesome-wasm
- Conway's Game of Life in Rust and WebAssembly: https://rustwasm.github.io/book/introduction.html
- Gate Demo game: https://github.com/SergiusIW/gate_demo
- A Cartoon Intro to WebAssembly: https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/