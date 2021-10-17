var Migrations = artifacts.require("./Rewards.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};