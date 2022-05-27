const hre = require("hardhat");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const testMetadata = { protocol: 1, pointer: "test-metadata" };
const updatedMetadata = { protocol: 1, pointer: "updated-metadata" };

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const OWNERS_LIST_SENTINEL = "0x0000000000000000000000000000000000000001";

describe("ProjectRegistry", function () {
  before(async function () {
    [this.owner, this.projectRecipient, this.nonOwner, ...this.accounts] =
      await ethers.getSigners();

    const ProjectRegistry = await hre.ethers.getContractFactory(
      "ProjectRegistry",
      this.owner
    );
    this.contract = await ProjectRegistry.deploy();
    await this.contract.deployed();
  });

  it("creates a new project and adds it to the projects list", async function () {
    expect(await this.contract.projectsCount()).to.equal("0");

    await this.contract.createProject(this.owner.address, testMetadata);

    expect(await this.contract.projectsCount()).to.equal("1");

    const project = await this.contract.projects(0);
    expect(project.id).to.equal("0");
    expect(project.recipient).to.equal(this.owner.address);

    const [protocol, pointer] = project.metadata;
    expect(protocol).to.equal(testMetadata.protocol);
    expect(pointer).to.equal(testMetadata.pointer);

    const isProjectOwner = await this.contract.activeProjectOwner(
      "0",
      this.owner.address
    );
    expect(isProjectOwner).to.equal(true);
  });

  it("does not allow update of project metadata if not owner", async function () {
    const project = await this.contract.projects(0);
    await expect(
      this.contract
        .connect(this.nonOwner)
        .updateProjectMetaData(project.id, updatedMetadata)
    ).to.be.revertedWith("not owner");
  });

  it("updates project metadata", async function () {
    const project = await this.contract.projects(0);
    await this.contract
      .connect(this.owner)
      .updateProjectMetaData(project.id, updatedMetadata);
    const updatedProject = await this.contract.projects(0);
    const [protocol, pointer] = updatedProject.metadata;
    expect(protocol).to.equal(updatedMetadata.protocol);
    expect(pointer).to.equal(updatedMetadata.pointer);
  });

  it("does not allow to add an owner if not owner", async function () {
    const projectID = 0;
    await expect(
      this.contract
        .connect(this.nonOwner)
        .addProjectOwner(projectID, this.nonOwner.address)
    ).to.be.revertedWith("not owner");
  });

  it("adds owner to project", async function () {
    const projectID = 0;

    expect(await this.contract.projectOwnersCount(projectID)).to.equal("1");
    expect(
      await this.contract.activeProjectOwner(projectID, this.owner.address)
    ).to.equal(true);

    for (let i = 0; i < 3; i++) {
      await this.contract
        .connect(this.owner)
        .addProjectOwner(projectID, this.accounts[i].address);
      expect(
        await this.contract.activeProjectOwner(
          projectID,
          this.accounts[i].address
        )
      ).to.equal(true);
    }

    expect(await this.contract.projectOwnersCount(projectID)).to.equal("4");
  });

  it("does not allow to remove an owner if not owner", async function () {
    const projectID = 0;
    await expect(
      this.contract
        .connect(this.nonOwner)
        .removeProjectOwner(projectID, this.owner.address, this.owner.address)
    ).to.be.revertedWith("not owner");
  });

  it("does not allow to remove owner 0", async function () {
    const projectID = 0;
    await expect(
      this.contract
        .connect(this.owner)
        .removeProjectOwner(projectID, this.owner.address, ZERO_ADDRESS)
    ).to.be.revertedWith("bad owner");
  });

  it("does not allow to remove owner with bad prevOwner", async function () {
    const projectID = 0;
    await expect(
      this.contract
        .connect(this.owner)
        .removeProjectOwner(
          projectID,
          this.nonOwner.address,
          this.owner.address
        )
    ).to.be.revertedWith("bad prevOwner");
  });

  it("removes owner", async function () {
    const projectID = 0;

    expect(await this.contract.projectOwnersCount(projectID)).to.equal("4");
    for (let i = 0; i < 3; i++) {
      expect(
        await this.contract.activeProjectOwner(
          projectID,
          this.accounts[i].address
        )
      ).to.equal(true);
    }

    await this.contract
      .connect(this.owner)
      .removeProjectOwner(
        projectID,
        this.accounts[1].address,
        this.accounts[0].address
      );
    expect(await this.contract.projectOwnersCount(projectID)).to.equal("3");

    await this.contract
      .connect(this.owner)
      .removeProjectOwner(
        projectID,
        this.accounts[1].address,
        this.owner.address
      );
    expect(await this.contract.projectOwnersCount(projectID)).to.equal("2");

    await this.contract
      .connect(this.accounts[2])
      .removeProjectOwner(
        projectID,
        this.accounts[2].address,
        this.owner.address
      );
    expect(await this.contract.projectOwnersCount(projectID)).to.equal("1");
  });

  it("does not allow to remove owner if single owner", async function () {
    const projectID = 0;
    expect(await this.contract.projectOwnersCount(projectID)).to.equal("1");
    expect(
      await this.contract.activeProjectOwner(
        projectID,
        this.accounts[2].address
      )
    ).to.eq(true);

    await expect(
      this.contract
        .connect(this.accounts[1])
        .removeProjectOwner(
          projectID,
          this.accounts[1].address,
          this.accounts[2].address
        )
    ).to.be.revertedWith("single owner");
  });
});
