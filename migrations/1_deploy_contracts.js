/*eslint no-undef: "off"*/
const LandscapeLottery = artifacts.require("LandscapeLottery");

module.exports = function(deployer) {
  deployer.deploy(LandscapeLottery);
};
