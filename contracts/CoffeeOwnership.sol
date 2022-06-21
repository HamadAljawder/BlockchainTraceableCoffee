// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

contract ProductManagement{
    struct Batch{
        address farmer;
        string lote_number;
        string batch_weight;
        string creation_date;
    }

    struct Product{
        address farmer;
        string lote_number;
        string product_type;
        string creation_date;
        bytes32[] batches;
    }

    mapping(bytes32 => Batch) public batches;
    mapping(bytes32 => Product) public products;

    function getBatchs(bytes32 product_hash) public returns (bytes32[6] memory) {}
}

contract CoffeeOwnership {

    enum OperationType {PART, PRODUCT}
    mapping(bytes32 => address) public currentBatchOwner;
    mapping(bytes32 => address) public currentProductOwner;

    event TransferBatchOwnership(bytes32 indexed p, address indexed account);
    event TransferProductOwnership(bytes32 indexed p, address indexed account);
    ProductManagement private pm;

    constructor(address prod_contract_addr) public {
        //Just create a new auxiliary contract. We will use it to check if the batch or product really exist
        pm = ProductManagement(prod_contract_addr);
    }

    function addOwnership(uint op_type, bytes32 p_hash) public returns (bool) {
        if(op_type == uint(OperationType.PART)){
            address farmer;
            (farmer, , , ) = pm.batches(p_hash);
            require(currentBatchOwner[p_hash] == address(0), "Batch was already registered");
            require(farmer == msg.sender, "Batch was not made by requester");
            currentBatchOwner[p_hash] = msg.sender;
            emit TransferBatchOwnership(p_hash, msg.sender);
        } else if (op_type == uint(OperationType.PRODUCT)){
            address farmer;
            (farmer, , , ) = pm.products(p_hash);
            require(currentProductOwner[p_hash] == address(0), "Product was already registered");
            require(farmer == msg.sender, "Product was not made by requester");
            currentProductOwner[p_hash] = msg.sender;
            emit TransferProductOwnership(p_hash, msg.sender);
        }
    }

    function changeOwnership(uint op_type, bytes32 p_hash, address to) public returns (bool) {
      //Check if the element exists and belongs to the user requesting ownership change
        if(op_type == uint(OperationType.PART)){
            require(currentBatchOwner[p_hash] == msg.sender, "Batch is not owned by requester");
            currentBatchOwner[p_hash] = to;
            emit TransferBatchOwnership(p_hash, to);
        } else if (op_type == uint(OperationType.PRODUCT)){
            require(currentProductOwner[p_hash] == msg.sender, "Product is not owned by requester");
            currentProductOwner[p_hash] = to;
            emit TransferProductOwnership(p_hash, to);
            //Change batch ownership too
            bytes32[6] memory part_list = pm.getBatchs(p_hash);
            for(uint i = 0; i < part_list.length; i++){
                currentBatchOwner[part_list[i]] = to;
                emit TransferBatchOwnership(part_list[i], to);
            }

        }
    }
}
