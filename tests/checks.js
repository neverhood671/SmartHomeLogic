const assert = require('assert');
const fs = require('fs');

var calcBestSchedule = require('../index.js');
var inputFileName = "../data/input.json";


//Попали ли все устройства в расписание
function isAllDevicesInSchedule(input, output) {
    var isCorrect = true;

    for (var i = 0; i < input.devices.length; i++) {
        if ((output.consumedEnergy.devices[input.devices[i].id] == undefined)) {
            isCorrect = false;
            break;
        }
    }

    assert(isCorrect, 'Не все устройства попали в расписание');
}

//не превышается ли максимальная мощность в каждый момент времени
function isSummaryPowerOk(input, output) {
    var isSummaryPowerOk = true;
    Object.keys(output.schedule).forEach((time) => {
        var power = 0;
        output.schedule[time].forEach(deviceId => {
            var device = input.devices.find(d => d.id === deviceId);
            power += device.power;
            if (power > input.maxPower) {
                isSummaryPowerOk = false;
            }
        })
    })

    assert(isSummaryPowerOk, 'Максимальная мощность превышена');
}

//Соответсвует ли распределение по времени режиму устройства
function isModeOk(input, output) {
    dayStart = 7,
        nightStart = 21,
        isTimeCorrect = true;

    Object.keys(output.schedule).forEach((time) => {
        output.schedule[time].forEach(deviceId => {
            var device = input.devices.find(d => d.id === deviceId);
            if (((device.mode == 'day') && ((time < dayStart) || (time >= nightStart))) ||
                ((device.mode == 'night') && ((time >= dayStart) && (time < nightStart)))) {
                isTimeCorrect = false;
            }
        })
    })

    assert(isTimeCorrect, 'Позиция устройства в расписании не соответствует его заявленному режиму');
}


var input = {
    "devices": [{
            "id": "F972B82BA56A70CC579945773B6866FB",
            "name": "Посудомоечная машина",
            "power": 950,
            "duration": 3,
            "mode": "night"
        },
        {
            "id": "C515D887EDBBE669B2FDAC62F571E9E9",
            "name": "Духовка",
            "power": 2000,
            "duration": 2,
            "mode": "day"
        },
        {
            "id": "02DDD23A85DADDD71198305330CC386D",
            "name": "Холодильник",
            "power": 50,
            "duration": 24
        },
        {
            "id": "1E6276CC231716FE8EE8BC908486D41E",
            "name": "Термостат",
            "power": 50,
            "duration": 24
        },
        {
            "id": "7D9DC84AD110500D284B33C82FE6E85E",
            "name": "Кондиционер",
            "power": 850,
            "duration": 1
        }
    ],
    "rates": [{
            "from": 7,
            "to": 10,
            "value": 6.46
        },
        {
            "from": 10,
            "to": 17,
            "value": 5.38
        },
        {
            "from": 17,
            "to": 21,
            "value": 6.46
        },
        {
            "from": 21,
            "to": 23,
            "value": 5.38
        },
        {
            "from": 23,
            "to": 7,
            "value": 1.79
        }
    ],
    "maxPower": 2100
};




var res = calcBestSchedule(input);


isAllDevicesInSchedule(input, res);
isSummaryPowerOk(input, res);
isModeOk(input, res);


console.info('OK!');