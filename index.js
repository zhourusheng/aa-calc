const COST = require('./data')
class AACalculator {
  constructor() {
    this.costs = [];
  }

  /* Add a new name to the list. */
  addName(name) {
    if (!this.containsName(name)) {
      this.assignPersonCost(name, 0);
    }
  }

  /* Assign amount of money cost to a given person's name. */
  assignPersonCost(name, cost) {
    var person = this.getCost(name);
    if (person != null) {
      person.cost = cost;
    }
    else {
      this.costs.push({ "name": name, "cost": cost });
    }
  }

  /* Check how much a person has cost. */
  getCost(name) {
    for (var i = 0; i < this.costs.length; i++) {
      if (this.costs[i].name == name) {
        return this.costs[i];
      }
    }
    return null;
  }

  /* Check whether the given name has been recorded. */
  containsName(name) {
    return this.getCost(name) != null;
  }


  /* Calculate the average cost of each person. */
  getAverageCost() {
    var average = 0.0;
    for (var i = 0; i < this.costs.length; i++) {
      average = average + this.costs[i].cost;
    }
    return average / this.costs.length;
  }

  /* Get a reformed cost list. Subtract the average cost by each person's cost. */
  getReformedCostLists() {
    var posCosts = [];
    var negCosts = [];
    var average = this.getAverageCost();
    for (var i = 0; i < this.costs.length; i++) {
      var name = this.costs[i].name;
      var cost = average - this.costs[i].cost;
      if (cost > 0) {
        posCosts.push({ "name": name, "cost": cost });
      }
      else {
        negCosts.push({ "name": name, "cost": -cost });
      }
    }
    posCosts.sort(function (a, b) { return a.cost - b.cost })
    negCosts.sort(function (a, b) { return a.cost - b.cost })
    return { "posCosts": posCosts, "negCosts": negCosts };
  }

  /* Compute an AA scheme. */
  computeAAResult() {
    if (this.costs.length == 0) {
      return null;
    }
    var rCosts = this.getReformedCostLists();
    var posCosts = rCosts['posCosts'];
    var negCosts = rCosts['negCosts'];
    var results = [];

    while (posCosts.length > 0 && negCosts.length > 0) {
      var posPerson = posCosts.pop();
      var negPerson = negCosts.pop();
      if (posPerson.cost == negPerson.cost) {
        var amount = posPerson.cost;
        var result = {
          "from": posPerson.name,
          "to": negPerson.name,
          "????????????": amount.toFixed(2)
        };
        results.push(result);
      }
      else if (posPerson.cost > negPerson.cost) {
        var amount = negPerson.cost;
        posPerson.cost = posPerson.cost - amount;
        posCosts.push(posPerson);
        var result = {
          "from": posPerson.name,
          "to": negPerson.name,
          "????????????": amount.toFixed(2)
        };
        results.push(result);
      }
      else {
        var amount = posPerson.cost;
        negPerson.cost = negPerson.cost - amount;
        negCosts.push(negPerson);
        var result = {
          "from": posPerson.name,
          "to": negPerson.name,
          "????????????": amount.toFixed(2)
        };
        results.push(result);
      }
    }
    return results;
  }
}

const AA = new AACalculator()

let all_total = 0

for (const key in COST) {
  if (Object.keys(COST[key]).length) {
    let total = 0
    for (const money in COST[key]) {
      if (COST[key][money]) {
        total += parseFloat(COST[key][money])
        console.log(`${key}:${money}?????????:`, COST[key][money])
      }
    }
    console.log(`${key}???????????????:`, total)
    all_total += total
    AA.assignPersonCost(key, total)
  } else {
    console.log(`${key}???????????????:`, COST[key])
    all_total += COST[key]
    AA.assignPersonCost(key, COST[key])
  }
}

console.log(`?????????????????????:`, all_total)
const personAverage = (all_total / Object.keys(COST).length).toFixed(2)
console.log(`??????????????????:`, personAverage)

const result = AA.computeAAResult()
console.log(result)