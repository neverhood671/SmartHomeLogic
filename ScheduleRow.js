class ScheduleRow {

    constructor(hour) {
        this.hour = hour;
        this.devices = [];
    }

    get summaryPower() {
        var summaryPower = 0;
        this.devices.forEach(d => { summaryPower += d.power });
        return summaryPower;
    }

    addDevice(device) {
        this.devices.push(device);
    }

    isDeviceCanBeAdded(device, maxPower){
        return (this.summaryPower + device.power <= maxPower);
    }

    get devicesIdList(){
        return this.devices.map(d => d.id);
    }
}

module.exports = ScheduleRow;