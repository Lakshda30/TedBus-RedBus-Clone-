router.post('/login', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    _id: user._id,
    email: user.email,
    name: user.name
  });
});
