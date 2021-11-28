const ProducerArtifact = artifacts.require("../contracts/Producer.sol");
const ProductArtifact = artifacts.require("../contracts/ProductManager.sol");

module.exports = (deployer, network) => {
  deployer.deploy(ProducerArtifact).then(function () {
    return deployer.deploy(ProductArtifact, ProducerArtifact.address);
  });
};
