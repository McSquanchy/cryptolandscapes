/*eslint no-undef: "artifacts"*/
const LandscapeLottery = artifacts.require("LandscapeLottery");

module.exports = function(deployer) {
  deployer.deploy(LandscapeLottery);
};
