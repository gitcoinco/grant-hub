export const slugs = {
  root: `/`,
  grants: `/grants`,
  grant: `/grants/:id`,
  edit: `/grants/:id/edit`,
  newGrant: `/grants/new`,
  round: `/program/:programId/round/:roundId`,
  roundApplication: `/program/:programId/round/:roundId/apply`,
};

export const rootPath = () => slugs.root;

export const grantsPath = () => slugs.grants;

export const newGrantPath = () => slugs.newGrant;

export const grantPath = (id: string | number) => `/grants/${id}`;

export const editPath = (id: string | number) => `/grants/${id}/edit`;

export const roundPath = (
  programId: string | number,
  roundId: string | number
) => `/program/${programId}/round/${roundId}`;

export const roundApplicationPath = (
  programId: string | number,
  roundId: string | number
) => `/program/${programId}/round/${roundId}/apply`;
