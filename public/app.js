async function init() {

    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");

    // Fetch the actual WebAssembly binary
    const response = await fetch("./wasm/clock.wasm");

    if (!response.ok) {
        throw new Error(`Failed to load WASM: ${response.status}`);
    }

    // Compile and instantiate the WASM binary
    const { instance } = await WebAssembly.instantiateStreaming(
        response, {}
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