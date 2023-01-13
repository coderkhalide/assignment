# Assignments

#### Ticket
```txt
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

    Data is saved in the database in the Facilities, Agents, and Shifts tables
    A function getShiftsByFacility is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
    A function generateReport is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.


You've been asked to work on a ticket. It reads:

Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

```

## Ticket Breakdown
### Ticket 1:

Title: Add custom Agent ID to Agent table
- Description: Add a new column to the Agents table in the database to store a custom Agent ID provided by the Facility.
- Acceptance Criteria:
    - The new column, "custom_agent_id", should be able to accept alphanumeric characters of a maximum length of 20.
    - A default value of null should be set for existing rows in the table.
- Time/Effort Estimate: 2 hours
- Implementation Details:
    - Use a database migration to add the new column to the Agents table.
    - Update the model for the Agent table to include the new custom_agent_id field.
    - Add validation to ensure that the custom_agent_id is alphanumeric and has a max length of 20.

### Ticket 2:

- Title: Update getShiftsByFacility function
- Description: Update the function to retrieve the custom Agent ID from the database instead of the internal database id when generating the list of Shifts.
- Acceptance Criteria:
    - The function should return the custom Agent ID in the Shift metadata when it is available.
    - If the custom Agent ID is not available, the internal database id should be used instead.
- Time/Effort Estimate: 1 hour
- Implementation Details:
    - Update the SQL query used in the function to retrieve the custom Agent ID from the Agents table.
    - Update the function to check for the existence of the custom Agent ID before returning it.

### Ticket 3:

- Title: Update generateReport function
- Description: Update the function to use the custom Agent ID when generating the PDF report for the Facility.
- Acceptance Criteria:
    - The function should use the custom Agent ID when it is available, otherwise it should use the internal database id.
    - The function should continue to generate a PDF report that includes the Agent's hours worked.
- Time/Effort Estimate: 1 hour
- Implementation Details:
    - Update the function to check for the existence of the custom Agent ID before using it.
    - Update the PDF template to use the custom Agent ID if it is available.

### Ticket 4:

- Title: Add Facility Admin Interface for managing custom Agent ID
- Description: Build an administrative interface for Facility to manage their Agent's custom Agent ID.
- Acceptance Criteria:
    - The interface should allow Facility to view a list of their Agent's and the custom Agent ID's associated with them.
    - The interface should allow Facility to add/update custom Agent ID for their Agent's
    - The interface should be accessible only to Facility Admins.
- Time/Effort Estimate: 4 hours
- Implementation Details:
    - Create a new endpoint for Facility admin to view/edit Agent's custom Agent ID's.
    - Create a new view for Facility admin to manage Agent's custom Agent ID's
    - Implement access control to make sure only Facility Admins can access the view.

### Ticket 5:

- Title: Testing and Deployment
- Description: Verify the changes made to the system and deploy it to production.
- Acceptance Criteria:
    - All the functionalities should work as expected.
    - System should be stable in production.
- Time/Effort Estimate: 2 hours
- Implementation Details:
    - Write test cases for the new functionalities.
    - Run test cases on the development environment.


# Code Refactor and Unit Tests

#### Refactored Function

```js
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
```
##### Explanation: 
I refactored the function by breaking it down into smaller and more manageable chunks. I introduced a variable `partitionKey` to store the partition key and added if-else statements to check for its existence. I also added a check for the event object itself before proceeding with the partition key checks. This makes the function more readable because it is now clear what the purpose of each block of code is and the flow of the function is more obvious. I also removed the unnecessary use of candidate variable. I also added a check to ensure that the partition key is a string. I also added a check to ensure that the partition key is not longer than 256 characters. If it is, I generate a sha3-512 hash of the partition key and return that instead. I also added little comments to explain what each block of code is doing. 

#### Unit Tests

```js
const { deterministicPartitionKey } = require("../app");

describe('deterministicPartitionKey', () => {
    it('should return trivial partition key when event object is not provided', () => {
        expect(deterministicPartitionKey()).toBe('0');
    });

    it('should return partition key when it exists in event object', () => {
        const event = { partitionKey: 'test' };
        expect(deterministicPartitionKey(event)).toBe('test');
    });

    it('should return sha3-512 hash of event data when partition key does not exist', () => {
        const event = { data: 'test' };
        expect(deterministicPartitionKey(event)).toMatch(/^[a-f0-9]{128}$/);
    });

    it('should return sha3-512 hash of partition key when it exceeds max length', () => {
        const event = { partitionKey: 'a'.repeat(257) };
        expect(deterministicPartitionKey(event)).toMatch(/^[a-f0-9]{128}$/);
    });

    it('should return a string when partition key is not a string', () => {
        const event = { partitionKey: { key: 'test' } };
        expect(deterministicPartitionKey(event)).toBe(JSON.stringify({ key: 'test' }));
    });
});
```
##### Explanation:
In this unit test, I am testing different scenarios that the function should handle, such as when the event object is not provided, when the partition key exists in the event object, when the partition key does not exist, when the partition key exceeds the max length, and when the partition key is not a string. I am using Jest's `expect` and `toBe` or `toMatch` to assert that the function returns the expected output for each scenario. This ensures that the refactor does not break any existing functionality and that the function continues to work as intended. 