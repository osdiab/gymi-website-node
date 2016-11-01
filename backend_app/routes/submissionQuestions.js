const NOT_YET_IMPLEMENTED = (req, res) => {
  res.status(501);
  res.send('Not yet implemented!');
};

export default {
  create: NOT_YET_IMPLEMENTED,
  destroy: NOT_YET_IMPLEMENTED,
  list: NOT_YET_IMPLEMENTED,
};
