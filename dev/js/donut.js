const DonutModule = (function () {

    // DOM 
    var $donut = document.querySelector('#donut'),
        $clicks = document.querySelector('#clicks'),
        $money = document.querySelector('#money');


    // Variables 
    var moneyOnClick = 1,
        moneyPerTime = 1,
        moneyEveryTime = 120 * 1000;

    // Methods 
    var countClick = function () {
        let value = parseInt($clicks.innerHTML);
        value++;
        $clicks.innerHTML = value;
    }

    var clickMoney = function () {
        let value = parseInt($money.innerHTML);
        value += moneyOnClick;
        $money.innerHTML = value;
    }

    var timeMoney = function () {
        let value = parseInt($money.innerHTML);
        value += moneyPerTime;
        $money.innerHTML = value;
        setTimeout(timeMoney, moneyEveryTime);
    }

    // Object
    var Upgrade = function (options) {
        this.level = 1;
        this.btn = options.btnElement;
        this.rM = options.requiredMoney;
        this.mM = options.moneyMultiplier;
        this.oM = options.obtainedMoney;
        this.uM = options.upgradeMultiplier;
        this.dE = options.donutElement;
        if (options.hasOwnProperty('statElement')) {
            this.sE = options.statElement;
        }
    }

    // Object Methods 
    Upgrade.prototype.boost = function () {
        let value = parseInt($money.innerHTML);
        if (value < this.rM) {
            return false;
        } else {
            this.level++;
            this.btn.previousElementSibling.children[1].innerHTML = this.level;
            value -= this.rM;
            $money.innerHTML = parseInt(value);
            this.checkUpgradeAvailable();
            this.rM = this.rM * this.mM;
            this.oM = parseInt(this.oM * this.uM);

            if (this.hasOwnProperty('sE')) {
                console.log(this.oM)
                this.sE.innerHTML = this.oM;
            }

            if (this.level % 2 == 0) {
                let color = getRandomColor();
                this.dE.forEach(function (item) {
                    item.style.fill = color;
                })
            }

            return parseInt(this.oM);
        }
    }

    Upgrade.prototype.checkUpgradeAvailable = function () {
        let value = parseInt($money.innerHTML);

        if (this.rM <= value) {
            this.btn.parentElement.classList.remove('disabled');
        } else {
            this.btn.parentElement.classList.add('disabled');
        }
    }

    // Creating Objects
    var clickUpgrade = new Upgrade({
        requiredMoney: 40,
        obtainedMoney: 1,
        moneyMultiplier: 2.5,
        upgradeMultiplier: 2,
        btnElement: document.querySelector('#clickUpgrade'),
        donutElement: document.querySelectorAll('.donut__topping')

    });

    var moneyEveryTimeUpgrade = new Upgrade({
        requiredMoney: 250,
        obtainedMoney: 120,
        moneyMultiplier: 3,
        upgradeMultiplier: 0.5,
        btnElement: document.querySelector('#timeUpgrade'),
        statElement: document.querySelector('#moneyEveryTime'),
        donutElement: document.querySelectorAll('.donut__frostig')
    });

    var moneyPerTimeUpgrade = new Upgrade({
        requiredMoney: 100,
        obtainedMoney: 1,
        moneyMultiplier: 3,
        upgradeMultiplier: 4,
        btnElement: document.querySelector('#moneyTimeUpgrade'),
        statElement: document.querySelector('#moneyPerTime'),
        donutElement: document.querySelectorAll('.donut__cake')
    });


    // Event Handlers
    $donut.addEventListener('click', function () {
        countClick();
        clickMoney();
    })

    $donut.addEventListener('mousedown', function (e) {
        e.preventDefault();
    }, false);


    clickUpgrade.btn.addEventListener('click', function () {
        moneyOnClick = clickUpgrade.boost() || moneyOnClick;
    });

    moneyEveryTimeUpgrade.btn.addEventListener('click', function () {
        moneyEveryTime = moneyEveryTimeUpgrade.boost() * 1000 || moneyEveryTime;
        window.clearTimeout(timeMoney);
        setTimeout(timeMoney, moneyEveryTime);
    });

    moneyPerTimeUpgrade.btn.addEventListener('click', function () {
        moneyPerTime = moneyPerTimeUpgrade.boost() || moneyPerTime;
    });

    // Init
    setTimeout(timeMoney, moneyEveryTime);
    setInterval(clickUpgrade.checkUpgradeAvailable.bind(clickUpgrade), 200);
    setInterval(moneyEveryTimeUpgrade.checkUpgradeAvailable.bind(moneyEveryTimeUpgrade), 200);
    setInterval(moneyPerTimeUpgrade.checkUpgradeAvailable.bind(moneyPerTimeUpgrade), 200);
})();
