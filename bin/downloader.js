const schedule = require('node-schedule');
const request = require('request');
const url = 'https://www.bitstamp.net/api/v2/transactions/btceur?time=day';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const Transaction = new Schema({
    date: Number,
    tid: Number,
    price: Number,
    type: Number,
    amount: Number
}, {
    versionKey: false
});

const TransactionModel = mongoose.model('transaction', Transaction);

const cron = '0 0 0,12 * * *';
// const cron = '0 * * * * *';
const job = schedule.scheduleJob(cron, function () {
    download();
});

function download() {
    console.log("downloading the transactions json");
    request.get({url: url, json: true}, (err, res, data) => {
        if (err) {
            console.log('error:', err);
        } else if (res.statusCode !== 200) {
            console.log('status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            console.log("transactions count: " + data.length);
            console.log("connecting to mongodb");
            mongoose.connect('mongodb://localhost:27017/bitstamp', {useMongoClient: true});
            console.log("inserting data to mongodb");
            TransactionModel.insertMany(data, {ordered: false})
                .then(docs => {
                    console.log("ok");
                })
                .catch(error => {
                    console.log("Error while inserting many transactions to mongodb");
                    console.log(error.message);
                    console.log("code: " + error.code);
                    console.log("number of errors: " + error.writeErrors.length);
                }).then(() => {
                    console.log("disconnecting");
                    mongoose.disconnect();
                });
        }
    });
}

//download();