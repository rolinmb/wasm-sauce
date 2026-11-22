export const wasmBinary = new Uint8Array([

    // ============================================================
    // WASM MAGIC NUMBER AND VERSION
    // ============================================================

    // Every WebAssembly binary begins with an 8-byte header.

    // Magic number: identifies this file as a WebAssembly module.
    // 0x00 0x61 0x73 0x6d = "\0asm"
    0x00, 0x61, 0x73, 0x6d,

    // Version number: 1
    // Encoded as a 32-bit little-endian integer.
    // 0x01 0x00 0x00 0x00 = 1
    0x01, 0x00, 0x00, 0x00,


    // ============================================================
    // TYPE SECTION (SECTION ID 1)
    // ============================================================

    // Describes the function signatures used by the module.
    //
    // Section structure:
    // [section ID] [section size] [section contents]

    0x01, // Section ID: 1 = Type section
    0x06, // Section payload size: 6 bytes

    0x01, // Number of function types: 1

    0x60, // Function type constructor (0x60)

    0x01, // Number of parameters: 1

    0x7e, // Parameter type: i64
    // 0x7e = WebAssembly i64

    0x01, // Number of return values: 1

    0x7e, // Return type: i64

    // Resulting function signature:
    //
    // (i64) -> (i64)
    //
    // One i64 parameter and one i64 return value.


    // ============================================================
    // FUNCTION SECTION (SECTION ID 3)
    // ============================================================

    // Declares the functions implemented by this module.
    // This section references function types defined above.

    0x03, // Section ID: 3 = Function section
    0x02, // Section payload size: 2 bytes

    0x01, // Number of functions: 1

    0x00, // Type index: 0
    // References the first function type.
    // That type is (i64) -> (i64).

    // We have declared one function.
    // Its actual instructions will be defined in the Code section.


    // ============================================================
    // EXPORT SECTION (SECTION ID 7)
    // ============================================================

    // Makes a module function accessible to JavaScript.
    //
    // Export section structure:
    // [section ID] [section size] [section contents]

    0x07, // Section ID: 7 = Export section
    0x18, // Section payload size: 24 bytes

    0x01, // Number of exports: 1

    0x14, // Export name length: 20 bytes
    // 0x14 = 20 decimal.

    // Export name: "secondsSinceMidnight"
    //
    // Each character is represented by its UTF-8 byte.
    //
    // s  e  c  o  n
    0x73, 0x65, 0x63, 0x6f, 0x6e,

    // d  s  S  i  n
    0x64, 0x73, 0x53, 0x69, 0x6e,

    // c  e  M  i  d
    0x63, 0x65, 0x4d, 0x69, 0x64,

    // n  i  g  h  t
    0x6e, 0x69, 0x67, 0x68, 0x74,

    0x00, // Export kind: 0 = Function

    0x00, // Function index: 0
    // References the first function declared
    // in the Function section.

    // JavaScript will access this function through:
    //
    // instance.exports.secondsSinceMidnight()


    // ============================================================
    // CODE SECTION (SECTION ID 10)
    // ============================================================

    // Contains the actual instructions executed by WASM.

    0x0a, // Section ID: 10 = Code section

    0x0f, // Section payload size: 15 bytes
    //
    // 1 byte: number of function bodies
    // 1 byte: function body size
    // 13 bytes: function body contents

    0x01, // Number of function bodies: 1

    0x0d, // Function body size: 13 bytes
    // Does not include this size field.

    // ------------------------------------------------------------
    // FUNCTION BODY
    // ------------------------------------------------------------

    0x00, // Local declarations vector length: 0
    // This function has no additional local variables.
    //
    // Its input parameter is still available as local 0.

    // ------------------------------------------------------------
    // INSTRUCTION 1: local.get 0
    // ------------------------------------------------------------

    0x20, // Opcode: local.get
    // Retrieves a function parameter or local variable.

    0x00, // Local index: 0
    // Retrieves the first parameter (i64 timestamp).

    // Stack:
    // [timestamp]


    // ------------------------------------------------------------
    // INSTRUCTION 2: i64.const 1000
    // ------------------------------------------------------------

    0x42, // Opcode: i64.const
    // Pushes a signed 64-bit integer constant.

    0xe8, 0x07, // Immediate value: 1000
    //
    // Encoded using signed LEB128.
    //
    // 1000 decimal = 0x03E8
    // Its signed LEB128 representation is:
    // 0xE8 0x07

    // Stack:
    // [timestamp, 1000]


    // ------------------------------------------------------------
    // INSTRUCTION 3: i64.div_u
    // ------------------------------------------------------------

    0x80, // Opcode: i64.div_u
    //
    // Divides the two top stack values.
    // Uses unsigned integer division.
    //
    // timestamp / 1000
    //
    // Removes both operands and pushes the quotient.

    // Stack:
    // [timestamp / 1000]


    // ------------------------------------------------------------
    // INSTRUCTION 4: i64.const 86400
    // ------------------------------------------------------------

    0x42, // Opcode: i64.const

    0x80, // LEB128 byte 1
    0xa3, // LEB128 byte 2
    0x05, // LEB128 byte 3
    //
    // Together these encode 86400.
    //
    // 86400 decimal = 0x015180
    //
    // Signed LEB128:
    // 0x80 0xA3 0x05

    // Stack:
    // [timestamp / 1000, 86400]


    // ------------------------------------------------------------
    // INSTRUCTION 5: i64.rem_u
    // ------------------------------------------------------------

    0x82, // Opcode: i64.rem_u
    //
    // Calculates the unsigned remainder.
    //
    // (timestamp / 1000) % 86400
    //
    // Produces seconds elapsed since midnight UTC.

    // Stack:
    // [secondsSinceMidnight]


    // ------------------------------------------------------------
    // INSTRUCTION 6: end
    // ------------------------------------------------------------

    0x0b // Opcode: end
    //
    // Marks the end of the function body.
    // The remaining stack value becomes the return value.

]);