const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const FALIX_HOST = 'riverwoodserver.falix.gg';
const FALIX_PORT = 20972;

// URLs for Gate Proxy binary depending on environment (Render uses Linux amd64)
const GATE_VERSION = '0.34.0'; 
const DOWNLOAD_URL = `https://github.com{GATE_VERSION}/gate_${GATE_VERSION}_linux_amd64`;
const binaryPath = path.join(__dirname, 'gate');

// 1. Setup the Gate configuration file dynamically
const configContent = `
config:
  bind: "0.0.0.0:${PORT}"
  compatibility:
    eaglercraft:
      enabled: true
      websocket:
        handshake: true
  servers:
    falix: "${FALIX_HOST}:${FALIX_PORT}"
  try:
    - falix
`;

function startGate() {
    console.log("Writing gate config.yml...");
    fs.writeFileSync(path.join(__dirname, 'config.yml'), configContent);

    console.log("Launching Gate Proxy process...");
    const gateProcess = spawn(binaryPath, ['-c', 'config.yml'], { stdio: 'inherit' });

    gateProcess.on('close', (code) => {
        console.log(`Gate Proxy exited with code ${code}`);
    });
}

// 2. Download Gate binary if it doesn't exist
if (!fs.existsSync(binaryPath)) {
    console.log(`Downloading Gate Proxy v${GATE_VERSION}...`);
    exec(`curl -L -o ${binaryPath} ${DOWNLOAD_URL} && chmod +x ${binaryPath}`, (err) => {
        if (err) {
            console.error("Failed to download or permission Gate binary:", err);
            process.exit(1);
        }
        console.log("Gate Proxy downloaded successfully.");
        startGate();
    });
} else {
    startGate();
}
