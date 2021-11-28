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
├── contract
├── frontend
├── migrations
├── tests
├── package.json
├── README.md
└── truffle-config.js
```

## Installation (Front End)
Use the package manager [npm](https://docs.npmjs.com/cli/v8/commands/npm-install) to install dependencies in frontend.

#### Build and run
* Dockerfile => docker build -t brandtrace-frontend . && docker run brandtrace-frontend
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
.
.
.
└── truffle-config.js
```



