import { clearDetails, partListManager, orderBatchListManager, addItemToList, format_date, getActiveBatch, init_web3 } from "./main.js"

window.onload = async function () {

    var x = await init_web3()

    document.getElementById("register-batch").addEventListener("click", function () {
        console.log("Create Batch")
        // Get required data and create batch on blockchain using web3

        var lote = document.getElementById("create-lote-number").value
        var batch_weight = document.getElementById("create-batch-type").value

        var creation_date = format_date()
        console.log("Lote: " + lote + " Date:" + creation_date + "Batch Type: " + batch_weight)

        //Create batch hash and send information to blockchain
        var part_sha = web3.utils.soliditySha3(window.accounts[0], web3.utils.fromAscii(lote),
            web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))

        window.pm.methods.registerBatch(lote, batch_weight, creation_date).send({ from: window.accounts[0], gas: 1000000 }, function (error, result) {
            console.log("Smart Contract Transaction sent")
            console.log(result)
        })

        console.log(part_sha)

        //Add batch hash to batch-list for querying
        addItemToList(part_sha, "batch-list", partListManager)
    })

    document.getElementById("batch-change-ownership-btn").addEventListener("click", function () {
        console.log("Change Ownership")
        //Get batch data from active item on owned list

        var hash_element = getActiveBatch("batch-list")
        if (hash_element != undefined) {
            var to_address = document.getElementById("batch-change-ownership-input").value
            if (to_address != "") {
                window.co.methods.changeOwnership(0, hash_element.textContent, to_address).send({ from: window.accounts[0], gas: 100000 }, function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log("Changed ownership")
                        //Logic to remove item from owned list
                        hash_element.parentElement.removeChild(hash_element)
                        clearDetails(document.getElementById("batch-list-details"))
                    }
                })
            }

        }
    })
}