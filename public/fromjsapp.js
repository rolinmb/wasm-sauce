import { wasmBinary } from "./wasm/wasmhex.js";

async function init() {

    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");

    // Compile and instantiate the WebAssembly binary
    const { instance } = await WebAssembly.instantiate(
        wasmBinary, {}
    );

    // Access exported WASM functions
    const wasm = instance.exports;

    function updateClock() {
        const timestamp = BigInt(Date.now());
        const seconds = BigInt(wasm.secondsSinceMidnight(timestamp));

        const hours = BigInt(seconds / BigInt(3600));
        const minutes = BigInt(seconds % BigInt(3600)) / BigInt(60);
        const remainingSeconds = BigInt(seconds % BigInt(60));

        dateElement.textContent = new Date().toISOString().slice(0, 10);

        timeElement.textContent =
            `${hours.toString().padStart(2, "0")}:` +
            `${minutes.toString().padStart(2, "0")}:` +
            `${remainingSeconds.toString().padStart(2, "0")} UTC`;
    }

    updateClock();

    setInterval(updateClock, 1000);
}

init().catch(console.error);