const NOT_YET_IMPLEMENTED = (req, res) => {
  res.status(501);
  res.send('Not yet implemented!');
};

export const credentials = {
  set: NOT_YET_IMPLEMENTED,
};

export const interests = {
  list: NOT_YET_IMPLEMENTED,
  update: NOT_YET_IMPLEMENTED,
};

export default {
  list: NOT_YET_IMPLEMENTED,
  find: NOT_YET_IMPLEMENTED,
  create: NOT_YET_IMPLEMENTED,
};
