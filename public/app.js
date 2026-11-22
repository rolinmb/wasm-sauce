async function init() {

    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");

    // Manually constructed WebAssembly binary

    const wasmBinary = new Uint8Array([

        // WASM magic number and version
        0x00, 0x61, 0x73, 0x6d,
        0x01, 0x00, 0x00, 0x00,

        // Type section
        0x01, 0x0b,
        0x02, 0x60, 0x01, 0x7e, 0x01, 0x7e,
        0x60, 0x01, 0x7e, 0x01, 0x7e,

        // Function section
        0x03, 0x03,
        0x02, 0x00, 0x01,

        // Export section
        0x07, 0x18,
        0x02,
        0x0a, 0x67, 0x65, 0x74, 0x53,
        0x65, 0x63, 0x6f, 0x6e, 0x64, 0x73,
        0x00, 0x00,
        0x13, 0x73, 0x65, 0x63, 0x6f,
        0x6e, 0x64, 0x73, 0x53, 0x69,
        0x6e, 0x63, 0x65, 0x4d, 0x69,
        0x64, 0x6e, 0x69, 0x67, 0x68, 0x74,
        0x00, 0x01,

        // Code section
        0x0a, 0x16,
        0x02,

        // Function 1: timestamp / 1000
        0x07, 0x00,
        0x20, 0x00,
        0x42, 0xe8, 0x07,
        0x80,
        0x0b,

        // Function 2: (timestamp / 1000) % 86400
        0x0c, 0x00,
        0x20, 0x00,
        0x42, 0xe8, 0x07,
        0x80,
        0x42, 0x80, 0xa3, 0x05,
        0x82,
        0x0b

    ]);

    // Compile binary
    const module = await WebAssembly.compile(wasmBinary);

    // Instantiate module
    const instance = await WebAssembly.instantiate(module);

    const wasm = instance.exports;

    function updateClock() {

        const timestamp = BigInt(Date.now());

        // Execute WASM instructions
        const seconds = wasm.secondsSinceMidnight(timestamp);

        // JavaScript handles date formatting
        dateElement.textContent = new Date().toLocaleDateString();

        const hours = Number(seconds / BigInt(3600));
        const minutes = Number((seconds % BigInt(3600)) / BigInt(60));
        const remainingSeconds = Number(seconds % BigInt(60));

        timeElement.textContent =
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(remainingSeconds).padStart(2, "0")} UTC`;
    }

    updateClock();

    setInterval(updateClock, 1000);
}

init();