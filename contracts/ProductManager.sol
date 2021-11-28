// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "./ProducerInterface.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ProductManager is Ownable{
    using SafeMath for uint;
    using SafeMath for int; 

    address payable contractOwner;
    bool private stopped;
    
    mapping(address => bool) verifierMapping;

    ProducerInterface producerInterface;
    

    struct Product{
        string name;
        string companycode;
        address origin;
        address currentOwner;
        address previousOwner;
        int counter;
        int currentPrice; // Price in USD with 2 Decimal
        address[] certificates;
        string [] oldOwnerPhoto;
        address [] oldPhotoOwner;
        address [] newPhotoOwner;
        string [] newOwnerPhoto;
        ProductStatus productStatus;
        uint productPositionInArray;
        bool verify;
        string comment;
    }

    enum ProductStatus {Init, Shipped, Owned, Verifying, Destroyed}

    //map id to Product
    mapping (string => Product) public productMapping;
    
    modifier onlyVerifier() {
        require(verifierMapping[msg.sender] == true , "Not Verifier!");
        _;
    }
    
    mapping (address => string[]) public ownerByProduct;

    event productCreated (string id, address owner);

    event productOwnershipTransferEvent (string id, address oldOwner, address newOwner, bytes32 status);

    constructor (address producer)  {
        contractOwner = payable(msg.sender);
        stopped = false;
        producerInterface = ProducerInterface(producer);
    }

    

    function toggleContractActive() onlyOwner public returns (bool) {
        stopped = !stopped;
        return stopped;
    }

    modifier stopInEmergency() {
        require(!stopped, "Circuit Breaker: ProductManager Contract is currently stopped.");
        _;
    }


    modifier onlyInEmergency() {
        require(stopped, "Circuit Breaker: ProductManager Contract is not currently stopped.");
        _;
    }

    modifier checkOwner(string memory _id) {
        require(msg.sender == productMapping[_id].currentOwner, "You are not the owner!");
        _;
    }

    modifier onlyProducer(string memory _companycode) {
        // require(isAuthorized(msg.sender),"");
        require(producerInterface.isAuthorized(msg.sender, _companycode), "Unauthorized producer");
        _;
    }

    function createProduct (string memory _id, string memory _companycode, string memory _name, int _price, string memory _photoHash) onlyProducer(_companycode) public {
        Product storage temp = productMapping[_id];
        temp.name = _name;
        temp.origin = msg.sender;
        temp.currentOwner = msg.sender;
        temp.currentPrice = _price;
        temp.counter = 1;
        // temp.oldOwnerPhoto[0] = stringToBytes32(_photoHash);]
        temp.oldOwnerPhoto.push(_photoHash);
        temp.oldPhotoOwner.push(msg.sender);
        temp.productStatus = ProductStatus.Init;
        temp.companycode = _companycode;
        
        ownerByProduct[msg.sender].push(_id);
        temp.productPositionInArray = ownerByProduct[msg.sender].length;
        
        // productMapping[_id] = temp;
        
        emit productCreated(_id, temp.currentOwner);
    
    }
    
    function transferOwner(string memory _id, address _newOwner, string memory _hash) checkOwner(_id) public  {
        require (productMapping[_id].productStatus == ProductStatus.Owned, "Product is currently not in a owned state");
        productMapping[_id].previousOwner = productMapping[_id].currentOwner;
        productMapping[_id].currentOwner = _newOwner;
        productMapping[_id].productStatus = ProductStatus.Shipped;
        productMapping[_id].oldOwnerPhoto.push(_hash);
        productMapping[_id].oldPhotoOwner.push(msg.sender);
        // delete ownerByProduct[msg.sender][productMapping[_id].productPositionInArray];
        emit productOwnershipTransferEvent(_id, msg.sender, _newOwner, "Shipped");
    }

    function receiveProduct(string memory _id, string memory _hash) public checkOwner(_id) {
        require (productMapping[_id].productStatus == ProductStatus.Shipped, "Product is currently not in a shipped state");
        
        delete ownerByProduct[productMapping[_id].previousOwner][productMapping[_id].productPositionInArray];
        ownerByProduct[msg.sender].push(_id);
        productMapping[_id].productPositionInArray = ownerByProduct[msg.sender].length;
        productMapping[_id].productStatus = ProductStatus.Owned;
        productMapping[_id].oldOwnerPhoto.push(_hash);
        productMapping[_id].oldPhotoOwner.push(msg.sender);
        productMapping[_id].verify = false;
        productMapping[_id].comment = "";


        emit productOwnershipTransferEvent(_id, productMapping[_id].previousOwner  , msg.sender, "Received");
    }

    function returnProduct(string memory _id) public checkOwner(_id) {
        require (productMapping[_id].productStatus == ProductStatus.Shipped, "Product is currently not in a shipped state");
        productMapping[_id].currentOwner = productMapping[_id].previousOwner;
        productMapping[_id].productStatus = ProductStatus.Owned;
        productMapping[_id].verify = false;
        emit productOwnershipTransferEvent(_id, productMapping[_id].previousOwner  , msg.sender, "Returned");
    }
    
    function destroyProduct(string memory _id) checkOwner(_id) public {
        require (productMapping[_id].productStatus == ProductStatus.Owned, "Product is currently not in a owned state");
        productMapping[_id].productStatus = ProductStatus.Destroyed;
        productMapping[_id].previousOwner = productMapping[_id].currentOwner;
        productMapping[_id].currentOwner = contractOwner;
        emit productOwnershipTransferEvent(_id, msg.sender , contractOwner, "Destroyed");
    }

    function getProductById (string memory _id) public view returns (Product memory _product) {
        return productMapping[_id];
    }
    
    function getPhotoHash(string memory _id) public view returns (string memory) {
        return productMapping[_id].oldOwnerPhoto[0];
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        require (bytes(source).length <= 32, "String is too long");
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }
    
    function toVerify(string memory _id) checkOwner(_id) public {
        require (productMapping[_id].productStatus == ProductStatus.Shipped, "No Shipped");
        productMapping[_id].productStatus = ProductStatus.Verifying;
    }
    
    function getPhotoToVerify(string memory _id) onlyVerifier() public view returns (string[] memory, string[] memory ) {
        return (productMapping[_id].oldOwnerPhoto,productMapping[_id].newOwnerPhoto); 
    }
    
    function verifyProduct(string memory _id, bool _result, string memory _comment) onlyVerifier public {
        require (productMapping[_id].productStatus == ProductStatus.Verifying);
        if (_result == true) {
            productMapping[_id].verify = true;
            productMapping[_id].comment = _comment;
        } else {
            productMapping[_id].verify = false;
            productMapping[_id].comment = _comment;
        }
        productMapping[_id].productStatus == ProductStatus.Shipped;
    }
    
    
    function getProductList(address _address) public view returns (string [] memory) {
        return ownerByProduct[_address];
    }
    
    function addPhoto(string memory _id,string memory _hash) checkOwner(_id) public {
        productMapping[_id].oldOwnerPhoto.push(_hash);
    }
    
    function deletePhoto(string memory _id, uint index) checkOwner(_id) public {
        require(productMapping[_id].oldPhotoOwner[index] == msg.sender, "You are not the owner");
    
        delete productMapping[_id].oldOwnerPhoto[index];
        delete productMapping[_id].oldPhotoOwner[index];
        
    }
    
    function addVerifier(address _address) onlyOwner()  public {
        verifierMapping[_address] = true;
    }
    

    fallback () external payable {}
    receive() external payable {
        // custom function code
    }


}
