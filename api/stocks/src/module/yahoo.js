const yf = require('yahoo-finance');

(async () => {
    const result = await yf
        .quote({
            symbol: '005930.KS',
            modules: ['price'],
        })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err);
            throw new Error('GET_PRICE_FAILED');
        });

    console.log(result);
})();
