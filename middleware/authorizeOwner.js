const pool = require('../config/db');

const authorizePostOwner = async (req, res, next) => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT user_id FROM blog_posts WHERE id = ?', [postId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const post = rows[0];
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not the owner of this post' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const authorizeCommentOwner = async (req, res, next) => {
    const userId = req.user.id;
    const commentId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const comment = rows[0];
        if (comment.user_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not the owner of this comment' });
        }

        next();
    } catch (error) {
        res.status  (500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authorizePostOwner,
    authorizeCommentOwner
};
