export const getOrigin = (url: string) => {
  return new URL(url).origin;
};

export const getListId = (url: string) => {
  return url.match(/\/list\/([a-zA-Z0-9-])+/g)[0].split('/')[2];
};
