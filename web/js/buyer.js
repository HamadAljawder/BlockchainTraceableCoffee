import { init_web3, getOwnedItemsFromEvent, dealerBatchListManager, dealerProductListManager, addItemToList } from "./main.js"

window.onload = async function () {

    var x = await init_web3()

    //First, get all the batches and products that belong to this dealer
    getOwnedItemsFromEvent(window.accounts[0], 'TransferBatchOwnership').then((batches) => {
        console.log("batch Events")
        console.log(batches)
        for (var i = 0; i < batches.length; i++) {
            addItemToList(batches[i], "batches-history", dealerBatchListManager)
        }
    })

    //Then, get products
    getOwnedItemsFromEvent(window.accounts[0], 'TransferProductOwnership').then((products) => {
        console.log("prod Events")
        console.log(products)
        for (var i = 0; i < products.length; i++) {
            addItemToList(products[i], "order-history", dealerProductListManager)
        }
    })

    // document.getElementById("get-history").addEventListener("click", function () {
    //     console.log("Get Order History")



    //     var addr = document.getElementById("batch-addr").value

    //     if (addr != "") {
    //         addItemToList(addr, "order-batch-list", orderBatchListManager)
    //     }
    // })
}