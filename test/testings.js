const ProductManagement = artifacts.require("ProductManagement");
const CoffeeOwnership = artifacts.require("CoffeeOwnership");

contract("ProductManagement", accounts => {

    var contract 
    beforeEach(async function() {
        contract = await ProductManagement.new({ from: accounts[0] })
    })

    it(".ﺎﻬﻨﻳﺰﺨﺗﻭ ةﻮﻬﻗ ﺔﻌﻓﺩ ﻞﻤﻋ ﻰﻠﻋ اًﺭﺩﺎﻗ نﻮﻜﻳ نﺃ ﺐﺠﻳ", () =>
        {
            const lote_number = "123456"
            const batch_weight = "3646"
            const creation_date = "04/06/22"
            return contract.registerBatch(lote_number, batch_weight, creation_date, { from: accounts[0] }).then( result => {
                //Transactions don't return values, we will just check the final result of the test
                p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_number),
                web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))
                return contract.batches.call(p_hash, { from: accounts[0] }).then(part_info => {
                    //The part_info is an object with the struct Batch fields as keys
                    // console.log(part_info)
                    assert.equal(part_info["farmer"], accounts[0])
                    assert.equal(part_info["lote_number"], lote_number)
                    assert.equal(part_info["batch_weight"], batch_weight)
                    assert.equal(part_info["creation_date"], creation_date)
                })
            })
        }
    );

    it("ﺎﻬﻨﻳﺰﺨﺗﻭ ةﻮﻬﻘﻟﺍ ﻦﻣ تﺎﻌﻓﺩ 6 مﺍﺪﺨﺘﺳﺎﺑ ﺐﻠﻃ ءﺎﺸﻧﺇ ﺐﺠﻳ", async () => {
        //First, create the order batches
        const lote_numbers = ["123456", "123457", "123458", "123459", "123450", "123451"]
        const part_types = ["453", "3454", "2323", "12", "34", "5465"]
        const creation_date = "04/06/22"
        let part_array = []

        let result
        for(let i =0; i< lote_numbers.length; i++){
            result = await contract.registerBatch(lote_numbers[i], part_types[i], creation_date, { from: accounts[0] })
            part_array.push(web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_numbers[i]),
                        web3.utils.fromAscii(part_types[i]), web3.utils.fromAscii(creation_date)))
        }

        //Then create the order itself from the batches. Each batch must be given as a hash that contains the wallet address and the batch info.
        const lote_prod = "12345678"
        const product_type = "order"

        result = await contract.registerProduct(lote_prod, product_type, creation_date, part_array, {from: accounts[0]})
        //Then check the order is in storage. Again, the hash should be the one below
        const p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_prod),
                                               web3.utils.fromAscii(product_type), web3.utils.fromAscii(creation_date))
        result = await contract.products.call(p_hash, {from:accounts[0]})
        assert.equal(result["farmer"], accounts[0])
        assert.equal(result["lote_number"], lote_prod)
        assert.equal(result["product_type"], product_type)
        assert.equal(result["creation_date"], creation_date)

        //Get batches and compare to the ones used when registering the order
        result = await contract.getBatchs.call(p_hash, {from:accounts[0]})
        for(i = 0; i< part_array.length; i++){
            assert.equal(result[i], part_array[i])
        }
    });

});

contract("CoffeeOwnership", accounts => {

    var pm
    var contract
    beforeEach(async function() {
        pm = await ProductManagement.new({ from: accounts[0] })
        contract = await CoffeeOwnership.new(pm.address, { from: accounts[0] })
    })

    it("ﻚﻟﺎﻣ ةﻮﻬﻘﻠﻟ نﻮﻜﻳ ﻻ ﺎﻣﺪﻨﻋ عﺭﺍﺰﻤﻠﻟ ﺔﻴﻜﻠﻤﻟﺍ ﻦﻋ لﺯﺎﻨﺘﻟﺍ ﻰﻠﻋ اًﺭﺩﺎﻗ نﻮﻜﻳ نﺃ ﺐﺠﻳ", async () => {
        const lote_number = "123456"
        const batch_weight = "24"
        const creation_date = "12/12/18"

        result = await pm.registerBatch(lote_number, batch_weight, creation_date, { from: accounts[0] })
        let p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_number),
                                             web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))
        
        // 0 means batch, 1 means product
        const op_type = 0
        result = await contract.addOwnership(op_type, p_hash)
        result = await contract.currentBatchOwner.call(p_hash)
        assert.equal(result, accounts[0])
    })

    it("ﻚﻟﺎﻤﻟﺍ ﺐﻠﻄﻳ ﺎﻣﺪﻨﻋ ﺔﻴﻜﻠﻤﻟﺍ ﺮﻴﻴﻐﺗ ﻰﻠﻋ اًﺭﺩﺎﻗ نﻮﻜﻳ نﺃ ﺐﺠﻳ", async () => {
        const lote_number = "123456"
        const batch_weight = "3432"
        const creation_date = "04/06/22"

        result = await pm.registerBatch(lote_number, batch_weight, creation_date, { from: accounts[0] })
        let p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_number),
                                             web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))
        
        // 0 means batch, 1 means product
        const op_type = 0
        result = await contract.addOwnership(op_type, p_hash, { from: accounts[0] })

        result = await contract.changeOwnership(op_type, p_hash, accounts[1], { from: accounts[0] })

        result = await contract.currentBatchOwner.call(p_hash)
        assert.equal(result, accounts[1])
    })
})

// Available Accounts
// ==================
// (0) 0x33CE1E9e47E2E4cEF2f1BfD1F31eE0c15b5F0a07 (100 ETH)
// (1) 0x979BA6496745EAf8d73c823B8938D53a26CD7a81 (100 ETH)
// (2) 0x550d7553Ab33Fb8c69a1438668C5371fd867CB7b (100 ETH)
// (3) 0x22f06CD65b81a9ABC0C769Fe0161A96b772ba68c (100 ETH)
// (4) 0xbb578d93F421A94E8424cDC2fD650eebFa8B5317 (100 ETH)
// (5) 0xA13609A188CBD4D3a8816C7473c60FcF14d01192 (100 ETH)
// (6) 0xaE0Ee5F65d25390b7bF4F7Ec29A1fFbF83F3Dd52 (100 ETH)
// (7) 0x347993731A91Cd70C27e2114830F4081C736FC64 (100 ETH)
// (8) 0xd4E9CcFad0E45Ff11FEa4cc45e89BE2B18b2590A (100 ETH)
// (9) 0xa65840C98820dD2653fa7E31EfFF2EA806711c0d (100 ETH)

// Private Keys
// ==================
// (0) 0xaaf46d59f626f910edff7ae2b3099f89bc21e424fe54638db20c64e06dab621f
// (1) 0x373eec07548f8a6cfa8baada6d77a5f03a13a55733ed6791a583586f20e0aff3
// (2) 0x421d8640f7dc58f322ff1ad276b62908c1d3bfa7b385cd45ff2ace8117c1feba
// (3) 0xe97b542d11c01e5cc13269f6b2e0712ea1e69779b5a82ca7388102619c4ada8b
// (4) 0x734efd42fbe3f09d932f6d188c89cc17c40231ee1e2a962f7aee9abd44b9612a
// (5) 0x096e8575d7072c36f99353eb97eabc08dc6b29e35bbf7fbeefc01600bb5e584a
// (6) 0x5c671c35ac0e4b130b7f086eb9943304e295c81e032e7ccf79d77472e48839ac
// (7) 0x45e62acd5f105efc2e8fda105214c3a22a38996e8fe0c2e76bc1d3e2c0f23d34
// (8) 0x48546da5c09224a1f33fe8301d23fc8becc9fcfed7a321510114a7d3287b94bb
// (9) 0x594dcab992b23e7436c7fcb1c00a93ef885b75246dc5a50f20c11ee65ba2379a

// Mnemonic:      
//potato remove shy coral drink bid retire poet velvet dash hood path