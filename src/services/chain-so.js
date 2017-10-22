const Bluebird = require("bluebird");
const req = Bluebird.promisify(require("request"));

module.exports = {
    check(addr) {
        return RegExp('^[LXD13][a-km-zA-HJ-NP-Z0-9]{26,33}$').test(addr);
    },

    fetch(addr) {
        const network = ({
            1: "BTC",
            3: "BTC",
            L: "LTC",
            X: "DASH",
            D: "DOGE"
        })[addr[0]];

        const url = `https://chain.so/api/v2/get_address_balance/${network}/${addr}`;

        return req(url, {json: true})
        .timeout(5000)
        .cancellable()
        .spread(function(resp, json) {
            if (resp.statusCode < 200 || resp.statusCode >= 300) throw new Error(JSON.stringify(resp));
            return {
                quantity: parseFloat(json.data.confirmed_balance),
                asset: network
            };
        });
    }
};