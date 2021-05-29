/*eslint no-undef: "off"*/
const LandscapeHelper = artifacts.require("LandscapeHelper");

module.exports = function(deployer) {
  deployer.deploy(LandscapeHelper);
};
