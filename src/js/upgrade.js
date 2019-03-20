const getRandomColor = require('./randomColor');

// CONSTRUCTOR
var Upgrade = function(options) {
  this.level = 1;
  this.btn = options.btnElement;
  this.rM = options.requiredMoney;
  this.mM = options.moneyMultiplier;
  this.oM = options.obtainedMoney;
  this.uM = options.upgradeMultiplier;
  this.dE = options.donutElement;
  this.eC = options.color || getRandomColor();
  if (options.hasOwnProperty('statElement')) {
    this.sE = options.statElement;
  }
};

// METHODS
Upgrade.prototype.boost = function(money) {
  
  if (money < this.rM) {
    console.log(this.oM * this.uM);
    return false;
  } else {
    this.level++;
    this.btn.previousElementSibling.children[1].innerHTML = this.level;
    this.checkUpgradeAvailable();
    let newMoney = parseInt(money - this.rM);
    this.rM = this.rM * this.mM;
    this.oM = parseInt(this.oM * this.uM);
    if (this.hasOwnProperty('sE')) {
      this.sE.innerHTML = this.oM;
    }
    this.setColor(getRandomColor());
    return {
      newMoney,
      newUpgrade: this.oM
    };
  }
};

Upgrade.prototype.setColor = function(color) {
  this.eC = color;
  this.dE.forEach((item) => {
    item.style.fill = this.eC;
  });
};

Upgrade.prototype.checkUpgradeAvailable = function(money) {
  if (this.rM <= money) {
    this.btn.parentElement.classList.remove('disabled');
  } else {
    this.btn.parentElement.classList.add('disabled');
  }
};

Upgrade.prototype.load = function({
  level,
  color
}) {
  if (level) {
    while (this.level != level) {
      this.boost(9999999999999);
    }
    if (color) {
      this.setColor(color);
    }
    return parseInt(this.oM);
  }

};

module.exports = Upgrade;
