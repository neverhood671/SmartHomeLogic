const DAY_MODE = "day",
    NIGHT_MODE = "night",
    MAX_DURATION = 24,
    DAY_START = 7,
    NIGHT_START = 21;

var PriceFunction = require("./PriceFunction"),
    ScheduleRow = require("./ScheduleRow"),
    Schedule = require("./Schedule");

module.exports = function(input) {

    validateInput(input);
    var devices = input.devices.sort((a, b) => {
            if (a.duration !== b.duration) {
                return b.duration - a.duration;
            }
            return a.power > b.power ? -1 : 1;
        }),
        rates = input.rates,
        maxPower = input.maxPower,
        schedule = new Schedule(),
        priceFunction = new PriceFunction(rates),
        finalDevicesConsumedEnergy = {};

    devices.forEach(d => {

        let prices = calcPricesForAllTimeRanges(d, priceFunction),
            bestChoice = getDeviceStartTimeAndFinalPrice(d, prices, schedule, maxPower),
            deviceStartTime = bestChoice.startTime,
            deviceBestPrice = bestChoice.price;

        if (deviceStartTime > -1) {
            for (let t = deviceStartTime; t < deviceStartTime + d.duration; t++) {
                schedule.scheduleRows[t].addDevice(d);
            }

            finalDevicesConsumedEnergy[d.id] = deviceBestPrice / 1000 * d.power;
        } else throw (`There is no avalible time for device ${d.id}`);

    });
    let summaryPover = Object.values(finalDevicesConsumedEnergy).reduce((x, y) => x + y),
        consumedEnergy = {
            value: summaryPover,
            devices: finalDevicesConsumedEnergy
        }
    return { schedule: schedule.getMainInfo(), consumedEnergy };
};


function getDeviceStartTimeAndFinalPrice(device, prices, schedule, maxPower) {
    let i = -1,
        isTimeForDeviceFound = false;
    while (!isTimeForDeviceFound && (i < prices.length)) {
        i++;
        isTimeForDeviceFound =
            schedule.isDeviceCanBeAdded(device, maxPower, prices[i].startTime, prices[i].startTime + device.duration);
    }
    return isTimeForDeviceFound ? prices[i] : -1;
}


function calcPricesForAllTimeRanges(device, priceFunction) {
    var tStartMin, tStartMax, prices = [];

    if (device.mode == NIGHT_MODE) {
        for (var t = NIGHT_START; t <= MAX_DURATION - device.duration; t++) {
            prices.push({
                startTime: t,
                price: priceFunction.getPrice(t, device.duration)
            });
        }
        tStartMin = 0;
        tStartMax = DAY_START - device.duration;
    } else if (device.mode == undefined) {
        tStartMin = 0;
        tStartMax = MAX_DURATION - device.duration;
    } else if (device.mode == DAY_MODE) {
        tStartMin = DAY_START;
        tStartMax = NIGHT_START - device.duration;
    }

    for (var t = tStartMin; t <= tStartMax; t++) {
        prices.push({
            startTime: t,
            price: priceFunction.getPrice(t, device.duration)
        });
    }

    return prices.sort((a, b) => a.price > b.price ? 1 : -1);
}


function validateInput(input) {
    if (!isNumber(input.maxPower)) throw new TypeError('Invalid input data: max power should be a number.');

    input.devices.forEach(d => {
        if (!isNumber(d.power) || !isNumber(d.duration)) throw new TypeError(`Invalid input data: Device ${d.id} data is incorrect! The power and duration should be a number.`);
        if (d.power > input.maxPower) throw new Error(`Invalid input data: Device ${d.id} needs more than max power!`);
        if ((d.duration > 24) || (d.duration < 0)) throw new RangeError(`Invalid input data: Duration of work for device ${d.id} is incorrect! It should be between 0 and 24 hours.`);
        if (((d.mode == DAY_MODE) && (d.duration > 14)) || ((d.mode == NIGHT_MODE) && (d.duration > 10)))
            throw new Error(`Invalid input data: Duration of work for device ${d.id} is longer than its mode max duration.`);
    });

    input.rates.forEach(r => {
        if (!isNumber(r.from) || !isNumber(r.to)) throw new TypeError("Invalid input data: rate.from and rate.to should be a number");
        if ((r.from < 1) || (r.to > 24)) throw new RangeError("Invalid input data: rates' from and to props shold be between 1 and 24");
    })
}


function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }