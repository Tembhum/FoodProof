// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

interface ProducerInterface {
    function registerProducer(address _producer, string memory _company_code, string memory _id, string memory _name, uint _validDuration) external;
    function isAuthorized(address _producer, string memory _companycode) external view returns (bool);
    function getProducerAddress (string memory _id) external view returns (address);
}