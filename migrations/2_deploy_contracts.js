var Announcement = artifacts.require("./Announcement.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Announcement, [accounts[1], accounts[2]], 1, 1);
};
