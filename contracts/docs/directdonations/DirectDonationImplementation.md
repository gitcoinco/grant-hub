# DirectDonationImplementation





Allows voters to cast multiple weighted votes to grants with one transaction This is inspired from BulkCheckout documented over at: https://github.com/gitcoinco/BulkTransactions/blob/master/contracts/BulkCheckout.sol Emits event upon every transfer.



## Methods

### VERSION

```solidity
function VERSION() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### vote

```solidity
function vote(bytes[] encodedVotes) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedVotes | bytes[] | undefined |

### vote

```solidity
function vote(bytes encodedVote) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| encodedVote | bytes | undefined |



## Events

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### Voted

```solidity
event Voted(address token, uint256 amount, address indexed voter, address grantAddress, bytes32 indexed projectId)
```

Emitted when a new vote is sent



#### Parameters

| Name | Type | Description |
|---|---|---|
| token  | address | undefined |
| amount  | uint256 | undefined |
| voter `indexed` | address | undefined |
| grantAddress  | address | undefined |
| projectId `indexed` | bytes32 | undefined |



