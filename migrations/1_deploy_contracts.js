const LandscapeAuction = artifacts.require("LandscapeAuction");

module.exports = function(deployer) {
  deployer.deploy(LandscapeAuction);
};
