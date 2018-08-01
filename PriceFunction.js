class PriceFunction {
    constructor(rates) {
        this.prices = [];
        rates.forEach(rate => {
            if (rate.from > rate.to) {
                this.prices.push({
                    endTime: 24,
                    price: rate.value
                });
            }
            this.prices.push({
                endTime: rate.to,
                price: rate.value
            });
        });
        this.prices.sort((a, b) => a.endTime > b.endTime ? 1 : -1);
    }

    getPrice(startTime, duration) {
        var i = 0,
            fullPrice = 0;
        
        while (startTime >= this.prices[i].endTime) {
            i++;
        }
        if (startTime + duration < this.prices[i].endTime) {
            fullPrice = duration * this.prices[i].price;
        } else {
            var t0 = startTime;
            while (duration > 0) {
               
                var workTime = duration > this.prices[i].endTime - t0 ? this.prices[i].endTime - t0 : duration;
                fullPrice += (workTime * this.prices[i].price);
                duration -= workTime;
                t0 = this.prices[i].endTime;
                i++;
            }
        }
        return fullPrice;
    }
}

module.exports = PriceFunction;