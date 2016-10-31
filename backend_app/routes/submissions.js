const NOT_YET_IMPLEMENTED = (req, res) => {
  res.status(501);
  res.send('Not yet implemented!');
};

export default {
  list: NOT_YET_IMPLEMENTED,
  post: NOT_YET_IMPLEMENTED,
};
