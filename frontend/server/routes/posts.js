const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const Customer = require('../models/customer');
const verifyToken = require('../middleware/verified');

function serializePost(post) {
  const postObject = post.toObject ? post.toObject() : post;
  return {
    ...postObject,
    likes: postObject.likeUserIds?.length || 0,
    reports: postObject.reportCount || 0,
    isPopular: (postObject.likeUserIds?.length || 0) + (postObject.comments?.length || 0) >= 5
  };
}

router.post('/add-post', verifyToken, async (req, res) => {
  try {
    const { title = '', content = '', topic = 'travel-advice', imageUrl = '' } = req.body || {};
    const trimmedContent = String(content).trim();

    if (!trimmedContent) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const customer = await Customer.findById(req.user.userId).lean();
    if (!customer?.isVerified) {
      return res.status(403).json({ error: 'Only verified users can create posts' });
    }

    const post = await Post.create({
      userId: req.user.userId,
      userName: customer.name || customer.email?.split('@')[0] || 'Traveler',
      topic: String(topic || 'travel-advice').trim(),
      title: String(title || '').trim(),
      content: trimmedContent,
      imageUrl: String(imageUrl || '').trim()
    });

    res.status(201).json({
      message: 'Post added',
      post: serializePost(post)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-posts', async (req, res) => {
  try {
    const topic = String(req.query.topic || '').trim();
    const filter = { isHidden: false };
    if (topic && topic !== 'all') {
      filter.topic = topic;
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts.map(serializePost));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
      isHidden: false
    }).sort({ createdAt: -1 });

    res.json(posts.map(serializePost));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/like/:id', verifyToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const post = await Post.findById(req.params.id);

    if (!post || post.isHidden) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likeUserIds.includes(userId)) {
      post.likeUserIds = post.likeUserIds.filter((id) => id !== userId);
    } else {
      post.likeUserIds.push(userId);
    }

    await post.save();
    res.json(serializePost(post));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/comment/:id', verifyToken, async (req, res) => {
  try {
    const text = String(req.body.comment || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const customer = await Customer.findById(req.user.userId).lean();
    const post = await Post.findById(req.params.id);

    if (!post || post.isHidden) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      userId: req.user.userId,
      userName: customer?.name || customer?.email?.split('@')[0] || 'Traveler',
      text
    });

    await post.save();
    res.json(serializePost(post));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/report/:id', verifyToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.reportedByUserIds.includes(userId)) {
      return res.status(400).json({ error: 'You already reported this post' });
    }

    post.reportedByUserIds.push(userId);
    post.reportCount = post.reportedByUserIds.length;
    if (post.reportCount >= 3) {
      post.isHidden = true;
    }

    await post.save();
    res.json(serializePost(post));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
