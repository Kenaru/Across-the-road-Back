const pool = require('../config/db');
const logger = require('../config/logger');

exports.getAllPosts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT bp.*, u.first_name, u.last_name, u.email 
            FROM blog_posts bp 
            JOIN users u ON bp.user_id = u.id
        `);

        const postIds = rows.map(post => post.id);
        if (postIds.length === 0) {
            return res.json([]); // If there are no posts, return an empty array
        }

        const [comments] = await pool.query(`
            SELECT c.*, u.first_name, u.last_name 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE post_id IN (?)
        `, [postIds]);

        const posts = rows.map(post => ({
            ...post,
            userName: `${post.first_name} ${post.last_name}`,
            userEmail: post.email,
            imageUrl: post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null,
            comments: comments.filter(comment => comment.post_id === post.id).map(comment => ({
                ...comment,
                userName: `${comment.first_name} ${comment.last_name}`
            }))
        }));

        logger.info('Fetched all posts with comments');
        res.json(posts);
    } catch (error) {
        logger.error(`Error fetching posts: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const [postRows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [id]);
        const post = postRows[0];
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const [commentRows] = await pool.execute('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC', [id]);
        post.comments = commentRows;
        post.imageUrl = post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null;
        logger.info(`Fetched post with ID: ${id}`);
        res.status(200).json(post);
    } catch (error) {
        logger.error(`Error fetching post with ID ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createPost = async (req, res) => {
    const { title, content, user_id } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log('Creating post with:', { title, content, user_id, image });

    if (!title || !content || !user_id) {
        return res.status(400).json({ error: 'Title, content, and user_id are required' });
    }
    try {
        const [result] = await pool.query('INSERT INTO blog_posts (title, content, user_id, image) VALUES (?, ?, ?, ?)', [title, content, user_id, image]);
        logger.info(`Post created with ID: ${result.insertId} by user ID: ${user_id}`);
        res.json({ id: result.insertId });
    } catch (error) {
        logger.error(`Error creating post: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : req.body.image; // Keep existing image if no new image is uploaded

    console.log('Updating post with ID:', req.params.id, 'with:', { title, content, image });

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    try {
        await pool.query('UPDATE blog_posts SET title = ?, content = ?, image = ? WHERE id = ?', [title, content, image, req.params.id]);
        logger.info(`Post updated with ID: ${req.params.id}`);
        res.json({ message: 'Post updated' });
    } catch (error) {
        logger.error(`Error updating post with ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await pool.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
        logger.info(`Post deleted with ID: ${req.params.id}`);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        logger.error(`Error deleting post with ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Create Comment
exports.createComment = async (req, res) => {
    const { content, user_id, post_id } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)',
            [content, user_id, post_id]
        );
        const [comment] = await pool.execute('SELECT * FROM comments WHERE id = ?', [result.insertId]);
        logger.info(`Comment created with ID: ${result.insertId} for post ID: ${post_id} by user ID: ${user_id}`);
        res.status(201).json(comment[0]);
    } catch (error) {
        logger.error(`Error creating comment: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update Comment
exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const [result] = await pool.execute(
            'UPDATE comments SET content = ? WHERE id = ?',
            [content, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        const [comment] = await pool.execute('SELECT * FROM comments WHERE id = ?', [id]);
        logger.info(`Comment updated with ID: ${id}`);
        res.status(200).json(comment[0]);
    } catch (error) {
        logger.error(`Error updating comment with ID ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        logger.info(`Comment deleted with ID: ${id}`);
        res.status(204).send();
    } catch (error) {
        logger.error(`Error deleting comment with ID ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Comment by ID
exports.getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const [comment] = await pool.execute('SELECT * FROM comments WHERE id = ?', [id]);
        if (comment.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        logger.info(`Fetched comment with ID: ${id}`);
        res.status(200).json(comment[0]);
    } catch (error) {
        logger.error(`Error fetching comment with ID ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get All Comments
exports.getAllComments = async (req, res) => {
    try {
        const [comments] = await pool.query('SELECT * FROM comments');
        logger.info(`Fetched all comments`);
        res.status(200).json(comments);
    } catch (error) {
        logger.error(`Error fetching comments: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};
