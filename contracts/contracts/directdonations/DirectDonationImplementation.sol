// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

/**
 * Allows voters to cast multiple weighted votes to grants with one transaction
 * This is inspired from BulkCheckout documented over at:
 * https://github.com/gitcoinco/BulkTransactions/blob/master/contracts/BulkCheckout.sol
 *
 * Emits event upon every transfer.
 */
contract DirectDonationImplementation is ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    string public constant VERSION = "0.1.0";

    // --- Event ---

    /// @notice Emitted when a new vote is sent
    event Voted(
        address token, // voting token
        uint256 amount, // voting amount
        address indexed voter, // voter address
        address grantAddress, // grant address
        bytes32 indexed projectId // project id
    );

    /**
     *
     * @dev
     * - supports ERC20 and Native token transfer
     *
     * @param encodedVote encoded vote
     */
    function _vote(bytes calldata encodedVote) internal {
        /// @dev decode encoded vote
        (
            address _token,
            uint256 _amount,
            address _grantAddress,
            bytes32 _projectId
        ) = abi.decode(encodedVote, (address, uint256, address, bytes32));

        if (_token == address(0)) {
            /// @dev native token transfer to grant address
            // slither-disable-next-line reentrancy-events
            AddressUpgradeable.sendValue(payable(_grantAddress), _amount);
        } else {
            /// @dev erc20 transfer to grant address
            // slither-disable-next-line arbitrary-send-erc20,reentrancy-events,
            SafeERC20Upgradeable.safeTransferFrom(
                IERC20Upgradeable(_token),
                msg.sender,
                _grantAddress,
                _amount
            );
        }

        /// @dev emit event for transfer
        emit Voted(_token, _amount, msg.sender, _grantAddress, _projectId);
    }

    function vote(bytes[] calldata encodedVotes) external payable nonReentrant {
        /// @dev iterate over multiple donations and transfer funds
        for (uint256 i = 0; i < encodedVotes.length; i++) {
            _vote(encodedVotes[i]);
        }
    }

    function vote(bytes calldata encodedVote) external payable nonReentrant {
        _vote(encodedVote);
    }
}
