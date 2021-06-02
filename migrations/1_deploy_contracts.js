/*eslint no-undef: "off"*/
const FetchableLandscape = artifacts.require("FetchableLandscape");

module.exports = function(deployer) {
  deployer.deploy(FetchableLandscape);
};
