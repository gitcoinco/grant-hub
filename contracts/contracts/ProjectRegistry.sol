// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./utils/MetaPtr.sol";
import "./utils/OwnerList.sol";

/**
 * @title ProjectRegistry
 * @notice todo
 * @dev todo
 */
contract ProjectRegistry {
    // Types
    // The project structs contains the minimal data we need for a project
    struct Project {
        uint96 id;
        address recipient;
        MetaPtr metadata;
    }

    // State variables

    // Used as sentinel value in the owners linked list.
    address OWNERS_LIST_SENTINEL = address(0x1);

    // The number of projects created, used to give an incremental id to each one
    uint96 public projectsCount;

    // The mapping of projects, from projectID to Project
    mapping(uint96 => Project) public projects;

    // The mapping projects owners, from projectID to OwnerList
    mapping(uint96 => OwnerList) public projectsOwners;

    // Events

    event ProjectCreated(address indexed owner, uint96 projectID);
    event MetaDataUpdated(address indexed owner, uint96 projectID);

    // Modifiers

    modifier onlyProjectOwner(uint96 projectID) {
        require(projectsOwners[projectID].list[msg.sender], "not owner");
        _;
    }

    constructor() {}

    // External functions

    /**
     * @notice todo
     * @dev todo
     */
    function createProject(address recipient, MetaPtr memory metadata) external {
        uint96 projectID = projectsCount++;

        Project storage g = projects[projectID];
        g.id = projectID;
        g.recipient = recipient;
        g.metadata = metadata;

        initProjectOwners(projectID, recipient);

        emit ProjectCreated(msg.sender, projectID);
    }

    /**
     * @notice Updates MetaData for singe project
     * @param projectID ID of previously created project
     * @param metadata Updated pointer to external metadata
     */
    function updateProjectMetaData(uint96 projectID, MetaPtr memory metadata) external onlyProjectOwner(projectID) {
        projects[projectID].metadata = metadata;
        emit MetaDataUpdated(msg.sender, projectID);
    }

    /**
     * @notice todo
     * @dev todo
     */
    function addProjectOwner(uint96 projectID, address newOwner) external onlyProjectOwner(projectID) {
        require(newOwner != address(0) && newOwner != address(this), "bad owner");

        OwnerList storage owners = projectsOwners[projectID];

        require(!owners.list[newOwner], "already owner");

        owners.list[newOwner] = true;
        owners.count++;
    }

    /**
     * @notice todo
     * @dev todo
     */
    function removeProjectOwner(uint96 projectID, address prevOwner, address owner) external onlyProjectOwner(projectID) {
        require(owner != address(0) && owner != OWNERS_LIST_SENTINEL, "bad owner");

        OwnerList storage owners = projectsOwners[projectID];

        require(owners.list[prevOwner], "bad prevOwner");
        require(owners.count > 1, "single owner");

        owners.list[owner] = false;
        owners.count--;
    }

    // Public functions

    /**
     * @notice todo
     * @dev todo
     */
    function projectOwnersCount(uint96 projectID) public view returns(uint256) {
        return projectsOwners[projectID].count;
    }

    function activeProjectOwner(uint96 projectID, address possibleOwner) public view returns(bool) {
        return projectsOwners[projectID].list[possibleOwner];
    }


    // Internal functions

    /**
     * @notice todo
     * @dev todo
     */
    function initProjectOwners(uint96 projectID, address recipient) internal {
        OwnerList storage owners = projectsOwners[projectID];

        owners.list[recipient] = true;
        owners.count = 1;
    }

    // Private functions
    // ...
}
