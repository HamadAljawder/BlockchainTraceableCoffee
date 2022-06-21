var Migrations = artifacts.require("./Migrations.sol");
var ProductManagement = artifacts.require("./ProductManagement.sol");
var CoffeeOwnership = artifacts.require("./CoffeeOwnership.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ProductManagement)
  .then(function(){
    return deployer.deploy(CoffeeOwnership, ProductManagement.address);
  })
};
