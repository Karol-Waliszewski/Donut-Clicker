require('./donut');
const Upgrade = require('./upgrade');
const Database = require('./database');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('Service-Worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope:', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

const clickerModule = (function() {

  // DOM
  var $donut = document.querySelector('#donut'),
    $clicks = document.querySelector('#clicks'),
    $money = document.querySelector('#money');

  // Variables
  var money = 0,
    clicks = 0,
    moneyOnClick = 1,
    moneyPerTime = 1,
    moneyEveryTime = 300 * 1000,
    database;

  // Methods
  var countClick = function() {
    clicks++;
    $clicks.innerHTML = clicks;
    Database.save('clicks', clicks);
  };

  var clickMoney = function() {
    updateMoney(money + moneyOnClick);

  };

  var timeMoney = function() {
    updateMoney(money + moneyPerTime);
    setTimeout(timeMoney, moneyEveryTime);
  };

  var updateMoney = function(value) {
    money = value;
    $money.innerHTML = value;
    Database.save('money', value);
  };

  // Creating Objects
  var clickUpgrade = new Upgrade({
    requiredMoney: 20,
    obtainedMoney: 1,
    moneyMultiplier: 3,
    upgradeMultiplier: 2,
    btnElement: document.querySelector('#clickUpgrade'),
    donutElement: document.querySelectorAll('.donut__topping')
  });

  var moneyEveryTimeUpgrade = new Upgrade({
    requiredMoney: 100,
    obtainedMoney: 300,
    moneyMultiplier: 2,
    upgradeMultiplier: 0.98,
    btnElement: document.querySelector('#timeUpgrade'),
    statElement: document.querySelector('#moneyEveryTime'),
    donutElement: document.querySelectorAll('.donut__frostig')
  });

  var moneyPerTimeUpgrade = new Upgrade({
    requiredMoney: 50,
    obtainedMoney: 1,
    moneyMultiplier: 2.25,
    upgradeMultiplier: 2,
    btnElement: document.querySelector('#moneyTimeUpgrade'),
    statElement: document.querySelector('#moneyPerTime'),
    donutElement: document.querySelectorAll('.donut__cake')
  });

  // Event Handlers
  var handleEvents = function() {
    $donut.addEventListener('click', function() {
      countClick();
      clickMoney();
    });

    $donut.addEventListener('mousedown', function(e) {
      e.preventDefault();
    }, false);

    clickUpgrade.btn.addEventListener('click', function() {
      let results = clickUpgrade.boost(money);
      if (results) {
        updateMoney(results.newMoney);
        moneyPerTime = results.newUpgrade;
        Database.save('moneyOnClick', {
          color: clickUpgrade.eC,
          level: clickUpgrade.level
        });
      }
    });

    moneyEveryTimeUpgrade.btn.addEventListener('click', function() {
      let results = moneyEveryTimeUpgrade.boost(money);
      if (results) {
        moneyEveryTime = results.newUpgrade * 1000;
        window.clearTimeout(timeMoney);
        setTimeout(timeMoney, moneyEveryTime);
        updateMoney(results.newMoney);
        Database.save('moneyEveryTime', {
          color: moneyEveryTimeUpgrade.eC,
          level: moneyEveryTimeUpgrade.level
        });
      }
    });

    moneyPerTimeUpgrade.btn.addEventListener('click', function() {
      let results = moneyPerTimeUpgrade.boost(money);
      if (results) {
        updateMoney(results.newMoney);
        moneyPerTime = results.newUpgrade;
        Database.save('moneyPerTime', {
          color: moneyPerTimeUpgrade.eC,
          level: moneyPerTimeUpgrade.level
        });
      }
    });
  };

  // Sets stats
  var setStats = function(stats) {
    for (let stat of stats) {
      if (typeof stat.value !== 'object' && stat.value.constructor !== Object) {
        eval(`${stat.key} = ${stat.value}`);
      } else {
        switch (stat.key) {
          case 'moneyPerTime':
            moneyPerTime = moneyPerTimeUpgrade.load(stat.value);
            break;
          case 'moneyEveryTime':
            moneyEveryTime = moneyEveryTimeUpgrade.load(stat.value) * 1000;
            break;
          case 'moneyOnClick':
            moneyOnClick = clickUpgrade.load(stat.value);
            break;

        }
      }
    }
    document.querySelector('#moneyEveryTime').innerHTML = moneyEveryTime / 1000;
    document.querySelector('#moneyPerTime').innerHTML = moneyPerTime;
    $clicks.innerHTML = clicks;
    $money.innerHTML = money;

  };

  // Sets intervals up
  var setIntervals = function() {
    setTimeout(timeMoney, moneyEveryTime);
    setInterval(function() {
      clickUpgrade.checkUpgradeAvailable(money);
    }, 200);
    setInterval(function() {
      moneyEveryTimeUpgrade.checkUpgradeAvailable(money);
    }, 200);
    setInterval(function() {
      moneyPerTimeUpgrade.checkUpgradeAvailable(money);
    }, 200);
  };

  // Init
  var init = function() {
    handleEvents();
    Database.open(function() {
      Database.load(setStats);
      setIntervals();
    });
  }();
})();
