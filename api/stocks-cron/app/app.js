const axios = require('axios');
const nodeCron = require('node-cron');

(async () => {
    let running = false;
    nodeCron.schedule('*/1 * * * * * *', async () => {
        if (!running) {
            running = true;
        }
    });
})();
