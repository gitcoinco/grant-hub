# graph

This package holds the subgraph which indexs data with regard the

- ProgramFactory
- ProgramImplementation
- RoundFactory
- RoundImplementation

#### Deployed Subgraphs

The following sections document the hosted services where the subgraph is deployed across different networks

| Network        | GITHUB_USER/SUBGRAPH_NAME                      | Playground                                                                                  | Query                                                                                  |
| -------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| optimism       | danielesalatti/grant-hub-project-registry      | https://thegraph.com/hosted-service/subgraph/danielesalatti/grant-hub-project-registry      | https://api.thegraph.com/subgraphs/name/danielesalatti/grant-hub-project-registry      |
| goerli         | danielesalatti/project-registry-goerli         | https://thegraph.com/hosted-service/subgraph/danielesalatti/project-registry-goerli         | https://api.thegraph.com/subgraphs/name/danielesalatti/project-registry-goerli         |
| optimism-kovan | danielesalatti/project-registry-optimism-kovan | https://thegraph.com/hosted-service/subgraph/danielesalatti/project-registry-optimism-kovan | https://api.thegraph.com/subgraphs/name/danielesalatti/project-registry-optimism-kovan |
| fantom         | danielesalatti/grantshub-project-registry-ftm  | https://thegraph.com/hosted-service/subgraph/danielesalatti/grantshub-project-registry-ftm  | https://api.thegraph.com/subgraphs/name/danielesalatti/grantshub-project-registry-ftm  |
| fantom-testnet | danielesalatti/grantshub-project-registry-ftt  | https://thegraph.com/hosted-service/subgraph/danielesalatti/grantshub-project-registry-ftt  | https://api.thegraph.com/subgraphs/name/danielesalatti/grantshub-project-registry-ftt  |

## Directory Structure

```
.
├── abis                        # human-readable abis of deployed contracts
├── docs                        # useful documentation
├── src
│   ├── projectregistry
│       ├── implementation.ts   # ProjectRegistry event handlers
│   ├── utils.ts                # useful helper functions
├── schema.graphql              # Entity schema
├── subgraph.template.yaml      # Subgraph configuration
├── tsconfig.json               # Typescript configuration
├── package.json                # Package configuration
└── .gitignore
└── README.md
```

## Queries

To know more about the queries which can be run on the playground, check out the [documentation](docs/)

## Deploy Subgraph

Generate your hosted-service API key on the graph

- Remove redundant files

```shell
rm -rf generated && rm -rf build
```

- Generate the `subgraph.yaml` for the network against which you'd like to deploy the subgraph

```shell
yarn prepare:<NETWORK_TO_DEPLOY_SUBGRAPH>
```

**Supported Networks**

| network        |
| -------------- |
| optimism       |
| goerli         |
| optimism-kovan |
| fantom         |
| fantom-testnet |

- Run codegen

```shell
graph codegen
```

- Authenticate hosted service

```shell
graph auth --product hosted-service <YOUR_API_KEY>
```

- Deploy Subgraph

```shell
graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>
```

Note: If you find yourself wanting to run the entire flow in one command.
Use this example where we deploy the subgraph on goerli

```shell
rm -rf generated && rm -rf build &&
    yarn prepare:goerli &&
    graph codegen &&
    graph auth --product hosted-service <YOUR_API_KEY> &&
    graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>
```
