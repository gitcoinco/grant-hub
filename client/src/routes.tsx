export const slugs = {
  root: `/`,
  grants: `/grants`,
  grant: `/grants/:id`,
  edit: `/grants/:id/edit`,
  newGrant: `/grants/new`,
  round: `/round/:id`,
  roundApplication: `/round/:id/apply`,
};

export const rootPath = () => slugs.root;

export const grantsPath = () => slugs.grants;

export const newGrantPath = () => slugs.newGrant;

export const grantPath = (id: string | number) => `/grants/${id}`;

export const editPath = (id: string | number) => `/grants/${id}/edit`;

export const roundPath = (id: string | number) => `/round/${id}`;

export const roundApplicationPath = (id: string | number) =>
  `/round/${id}/apply`;
