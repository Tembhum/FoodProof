# BrandTrace : Brand Provenance on Blockchain

## Problem:
* Fake products can be widely found in the market
* Untransparent supply chain
* Unable to prove the origin of the product
* Unable to trust proof and certificates from other countries
* **USE CASE** => brand traceability and anti-counterfeiting
* **Outside of brand name** => we can adapt the same system into a food and pharmaceutical provenance to avoid fake or uncertified items

## Why Blockchain:
* When brand names are imported, the originality can be hard to track. 
* Central authorities in a specific country might not be trusted by parties outside of the country. 
* For instance, if you buy a Louis Vuitton bag from Paris, the bag will probably cost a fortune. This implies that customers will be more comfortable if they are provided with provenance from LV itself and these origin proof’s integrity should remain. 
* Smart contract are globally trusted (if the system is fully open sourced and well-designed)

## Folder Structure:
```
.
├── contract                -> smart contracts
├── frontend                -> frontend
├── migrations              -> truffle migration folder
├── package.json            -> dependencies
├── README.md               
└── truffle-config.js       -> truffle configuration file
```

## Installation (Front End)
Use the package manager [npm](https://docs.npmjs.com/cli/v8/commands/npm-install) to install dependencies in frontend.

#### Build and run
* Dockerfile => npm install && docker build -t brandtrace-frontend . && docker run -p 3000:3000 brandtrace-frontend
* npm => npm install && npm start
* yarn => yarn install && yarn start

##### Configurating new addresses and abi
```
.
├── contract
├── frontend
|       └── src
|            └── abi
|                 └── abis
|                 └── addresses.js
|                 └── abi.js
.
.
.
└── truffle-config.js
```

## Installation (Smart Contract)
#### Deployment
* Remix IDE => Copy contract to remix, compile, copy the abi to frontend.
* Truffle

###### Deploy on Truffle (localhost)
1.  Install truffle (https://www.trufflesuite.com/docs/truffle/getting-started/installation) and ganache-cli (https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/).
2.  truffle compile
3.  ganache-cli
4.  truffle migrate
5.  copy abi inside build/Producer.json and build/ProductManager.json and both addresses to frontend




