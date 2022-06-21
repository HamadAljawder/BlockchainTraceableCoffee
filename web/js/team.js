import { orderListManager, addItemToList, format_date, init_web3, orderBatchListManager, getMultipleActiveBatch, getActiveBatch, clearOrderDetails, getOwnerHistoryFromEvents, getOwnedItemsFromEvent } from "./main.js"



window.onload = async function () {

    var x = await init_web3()

    // document.getElementById("register-batch").addEventListener("click", function () {
    //     console.log("Register Received Batch")

    //     var addr = document.getElementById("batch-addr").value

    //     if(addr != ""){
    //         addItemToList(addr, "order-batch-list", orderBatchListManager)
    //     }
    // })

    //Get all the batches that belonged to this factory and then check the ones that still do
    var batches = await getOwnedItemsFromEvent(window.accounts[0], 'TransferBatchOwnership')
    console.log(batches)
    for (var i = 0; i < batches.length; i++) {
        var owners = await getOwnerHistoryFromEvents('TransferBatchOwnership', batches[i])
        console.log(owners)
        if (owners[owners.length - 1] == window.accounts[0]) {
            addItemToList(batches[i], "order-batch-list", orderBatchListManager)
        }
    }

    document.getElementById("register-order").addEventListener("click", function () {
        console.log("Register Order")

        //First, get the lote number
        var lote = document.getElementById("create-order-lote-number").value
        if (lote != "") {
            //Then the batches that will be present on the order
            var part_list = getMultipleActiveBatch()
            var part_array = []
            for (var i = 0; i < part_list.length; i++) {
                part_array.push(part_list[i].textContent)
            }

            // //Fill batch array with dummy elements for the unprovided batches
            // while(part_array.length < 6){
            //     part_array.push("0x0")
            // }
            var creation_date = format_date()

            console.log("Create order with params")
            console.log(lote)
            console.log(part_array)
            console.log(creation_date)
            //Finally, register the order
            window.pm.methods.registerProduct(lote, "Order", creation_date, part_array).send({ from: window.accounts[0], gas: 2000000 }, function (error, result) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Order created")
                    //Add hash to order owned list
                    var order_sha = web3.utils.soliditySha3(window.accounts[0], web3.utils.fromAscii(lote),
                        web3.utils.fromAscii("Order"), web3.utils.fromAscii(creation_date))
                    addItemToList(order_sha, "order-list", orderListManager)

                    //Remove batches from available list
                    for (var i = 0; i < part_list.length; i++) {
                        part_list[i].removeEventListener("click", orderBatchListManager)
                        part_list[i].parentElement.removeChild(part_list[i])
                    }
                }
            })
        }
    })

    document.getElementById("order-change-ownership-btn").addEventListener("click", function () {
        console.log("Change Ownership")
        //Get order hash from active item on owned list

        var hash_element = getActiveBatch("order-list")
        if (hash_element != undefined) {
            var to_address = document.getElementById("order-change-ownership-input").value
            if (to_address != "") {
                window.co.methods.changeOwnership(1, hash_element.textContent, to_address).send({ from: window.accounts[0], gas: 100000 }, function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log("Changed ownership")
                        //Logic to remove item from owned list
                        hash_element.parentElement.removeChild(hash_element)
                        clearOrderDetails()
                    }
                })
            }

        }
    })
}