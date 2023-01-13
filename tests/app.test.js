// Unit tests for the refactored function
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

/* 
    Explanation: In this unit test, I am testing different scenarios that the function should handle, such as when the event object is not provided, when the partition key exists in the event object, when the partition key does not exist, when the partition key exceeds the max length, and when the partition key is not a string. I am using Jest's `expect` and `toBe` or `toMatch` to assert that the function returns the expected output for each scenario. This ensures that the refactor does not break any existing functionality and that the function continues to work as intended. 
*/