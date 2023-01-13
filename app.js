const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
    const TRIVIAL_PARTITION_KEY = "0";
    const MAX_PARTITION_KEY_LENGTH = 256;

    // Check if event object exists
    if (!event) {
        return TRIVIAL_PARTITION_KEY;
    }

    let partitionKey = event.partitionKey;

    // If partition key does not exist, generate a sha3-512 hash of the event data
    if (!partitionKey) {
        partitionKey = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    }

    // Ensure partition key is a string
    if (typeof partitionKey !== "string") {
        partitionKey = JSON.stringify(partitionKey);
    }

    // If partition key is longer than MAX_PARTITION_KEY_LENGTH, generate a sha3-512 hash of the partition key
    if (partitionKey.length > MAX_PARTITION_KEY_LENGTH) {
        partitionKey = crypto.createHash("sha3-512").update(partitionKey).digest("hex");
    }

    return partitionKey;
};

/* 
    Explanation: I refactored the function by breaking it down into smaller and more manageable chunks. I introduced a variable `partitionKey` to store the partition key and added if-else statements to check for its existence. I also added a check for the event object itself before proceeding with the partition key checks. This makes the function more readable because it is now clear what the purpose of each block of code is and the flow of the function is more obvious. I also removed the unnecessary use of candidate variable. I also added a check to ensure that the partition key is a string. I also added a check to ensure that the partition key is not longer than 256 characters. If it is, I generate a sha3-512 hash of the partition key and return that instead. I also added little comments to explain what each block of code is doing. 
*/