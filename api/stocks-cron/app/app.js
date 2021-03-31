const axios = require('axios');
const nodeCron = require('node-cron');

(async () => {
    let running = false;
    nodeCron.schedule('*/1 * * * * * *', async () => {
        console.log('HI');
        if (!running) {
            running = true;
        }
    });
})();
