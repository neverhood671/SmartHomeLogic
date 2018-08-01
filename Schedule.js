var ScheduleRow = require("./ScheduleRow");

class Schedule {

    constructor() {
        this.scheduleRows = Array.from(Array(24), (e, i) => new ScheduleRow(i));
    }

    addDevice(hour, device) {
        this.scheduleRows[hour].addDevice;
    }

    isDeviceCanBeAdded(device, maxPower, startTime, endTime) {
        let res = true;
        for (let t = startTime; t < endTime; t++) {
            if (!this.scheduleRows[t].isDeviceCanBeAdded(device, maxPower)) {
                res = false;
            }
        }
        return res;
    }

    toJSON() {
        let json = '';
        this.scheduleRows.forEach( row => {
        	json += `"${row.hour}": [${row.devicesIdList}],`;
        });

        return `"schedule": {${json}}`;
    }
}

module.exports = Schedule;