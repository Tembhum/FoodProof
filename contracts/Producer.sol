// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Producer is Ownable {
    using SafeMath for uint;

    address administrator;

    mapping (address => ProducerInfo) public Producers;
    mapping (string => address) ProducerAddresses;

    struct ProducerInfo {
        string id;
        string company_code;
        string name;
        uint expireTime;
    }

    event NewProducer(address _producerAddress, string _id, string _name);

    modifier onlyAdmin() {
        require(msg.sender == administrator, "Not admin");
        _;
    }

    function changeAdmin(address _newAdmin) onlyOwner public{
        administrator = _newAdmin;
    }

    constructor() {
        administrator = msg.sender;
    }

    function registerProducer(address _producer, string memory _company_code, string memory _id, string memory _name, uint _validDuration) onlyAdmin public{
        Producers[_producer].id = _id;
        Producers[_producer].name = _name;
        Producers[_producer].company_code = _company_code;
        Producers[_producer].expireTime = block.timestamp + _validDuration;
        ProducerAddresses[_id] = _producer;
        emit NewProducer(_producer, _id, _name);
    }

    function isAuthorized(address _producer, string memory _companycode) public view returns (bool){
        if (compareStrings(_companycode,Producers[_producer].company_code)){
            return true;
        } else {
            return false;
        }
    }

    function getProducerAddress (string memory _id) public view returns (address) {
        return ProducerAddresses[_id];
    }
    
    function getCompanyCode(string memory _id) public view returns (string memory) {
        return Producers[ProducerAddresses[_id]].company_code;
    }

    // function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    //     bytes memory tempEmptyStringTest = bytes(source);
    //     if (tempEmptyStringTest.length == 0) {
    //         return 0x0;
    //     }
    //     assembly {
    //         result := mload(add(source, 32))
    //     }
    // }
    
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}
