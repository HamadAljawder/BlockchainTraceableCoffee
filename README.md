# Traceability/Authenticity Coffee Supply Chain Demo.

A simple supply chain authenticity/tracebility demo that records owenership and transactions of products on the ethereum blokchain using smart contracts. It is based on the coffee industry suppply chain (direct-trade model).

The functionality is provided by two Smart Contracts:

* CoffeeManagement - Register Coffee batches and keep their data on ethereum.
* ChangeOwnership - Tracks ownership of the coffee in each stage.

We have a simple web interface to interact with the contracts that assume three roles: Farm, Local Team, and Client.
Each has its own view (page) and we keep them separated to better demonstrate how different parties could use the contracts.

## Setup and Running

The smart contracts and the tests [Truffle](https://truffleframework.com/truffle) and [Ganache](https://truffleframework.com/ganache) are used., so first install them: `npm install -g ganache-cli truffle`


Install [Metamask](https://metamask.io/) extension to enable web3 interaction with browser.

Run ganache-cli and designate 3 accounts for our 3 roles, them add them to Metamask. Make sure Metamask is connected to 'localhost:8545'.

Deploy the contracts: In terminal: `truffle migrate --reset`.

After Tuffle is done compiling and deploying, Take note of the new ChangeOwnership and CoffeeManagement addresses and replace the values on "web/js/main.js" in the following parts:

```
[Line: 355] window.pm.options.address = "Your New Address Here"
...
[Line:499] window.co.options.address = "Your New Address Here"
```

In terminal run 'truffle test' to run the test file and check if the smart contracts are functional. 

Run the app and explore the UI.

### The Flow

@ The farm:

* Pack coffee and add batch #, type, and weight.
* Register the coffee to the owner.
* Type the Local Team wallet address and click on "Change Ownership" to send it to them.

@ Local Team:

* Assemble orders based on coffee batches recieved from farmers (with a minimum set to 6 batches).
* Register order ownership to Local Team.
* Add Client wallet addresss and transfer ownership of order (along with details of each indiviual coffee batch) to them.

Dealers:

* Able to see orders owned and their history:
- From which farm
- Types of coffee batches
- Weights of diffrent batches
- Which team proccessed the order. 
- List of addresses that were the owners of the order (and it's batches).

#### Credits

* [Truffle Suite](https://truffleframework.com/)
* [Semantic UI](https://semantic-ui.com/)
