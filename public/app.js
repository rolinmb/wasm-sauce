import { wasmBinary } from "./wasm/wasmhex.js";

async function init() {

    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");

    const { instance } = await WebAssembly.instantiate(
        wasmBinary, {}
    );

    const wasm = instance.exports;

    function updateClock() {

        const timestamp = BigInt(Date.now());

        const seconds = wasm.secondsSinceMidnight(timestamp);

        const hours = Number(seconds / BigInt(3600));
        const minutes = Number((seconds % BigInt(3600)) / BigInt(60));
        const remainingSeconds = Number(seconds % BigInt(60));

        dateElement.textContent = new Date().toLocaleDateString();

        timeElement.textContent =
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(remainingSeconds).padStart(2, "0")} UTC`;
    }

    updateClock();

    setInterval(updateClock, 1000);
}

init();