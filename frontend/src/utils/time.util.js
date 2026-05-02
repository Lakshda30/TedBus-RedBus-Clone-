exports.isWithin24Hours = (createdAt) => {
  const now = new Date();
  const diff = now - new Date(createdAt);
  return diff <= 24 * 60 * 60 * 1000;
};
