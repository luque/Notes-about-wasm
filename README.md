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



## References

- Conway's Game of Life in Rust and WebAssembly: https://rustwasm.github.io/book/introduction.html
- Gate Demo game: https://github.com/SergiusIW/gate_demo