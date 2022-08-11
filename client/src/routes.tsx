export const slugs = {
  root: `/`,
  grants: `/grants`,
  grant: `/grants/:id`,
  edit: `/grants/:id/edit`,
  newGrant: `/grants/new`,
  round: `/:chainId/rounds/:roundId`,
  roundApplication: `/rounds/:id/apply`,
};

export const rootPath = () => slugs.root;

export const grantsPath = () => slugs.grants;

export const newGrantPath = () => slugs.newGrant;

export const grantPath = (id: string | number) => `/grants/${id}`;

export const editPath = (id: string | number) => `/grants/${id}/edit`;

export const roundPath = (chainId: string, roundId: string) =>
  `/${chainId}/rounds/${roundId}`;

export const roundApplicationPath = (id: string | number) =>
  `/rounds/${id}/apply`;
