const express = require('express');
const NodeWebcam = require('node-webcam');
const app = express();
const port = 3000;

// Configure webcam options
const webcamOptions = {
    width: 640,
    height: 480,
    quality: 30,
    frames: 420, // Capture multiple frames per second
    saveShots: false,
    output: "jpeg",
    device: false, // Change to specific device if needed, e.g., "/dev/video0"
    callbackReturn: "buffer", // Return a buffer instead of a file location
    verbose: true // Enable verbose logging for debugging
};

// Initialize the webcam
const webcam = NodeWebcam.create(webcamOptions);

app.get('/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    });

    const sendFrame = () => {
        webcam.capture('frame', (err, data) => {
            if (err) {
                console.error('Error capturing frame:', err);
                return;
            }
            res.write(`--frame\r\n`);
            res.write('Content-Type: image/jpeg\r\n\r\n');
            res.write(data, 'binary');
            res.write('\r\n');
            setTimeout(sendFrame, 1000 / 30); // Send 30 frames per second
        });
    };

    sendFrame();
});

app.listen(port, () => {
    console.log(`MJPEG stream running at http://localhost:${port}/stream`);
});
