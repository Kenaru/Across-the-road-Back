const pool = require('../config/db');
const logger = require('../config/logger');

const insertNavbar = async (req, res) => {
    console.log('Received insertNavbar request');
    const { userId } = req.body; // Ensure userId is being used
    const file = req.file;

    if (!file) {
        console.log('No logo file uploaded');
        return res.status(400).json({ error: 'No logo file uploaded' });
    }

    const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    console.log(`Generated logo URL: ${logoUrl}`);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction started');

        const [pageResult] = await connection.query('SELECT id FROM pages WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
        const pageId = pageResult.length > 0 ? pageResult[0].id : null;

        if (!pageId) {
            console.log('No page found for the user');
            return res.status(404).json({ error: 'No page found for the user' });
        }

        const navbarSql = 'INSERT INTO navbar (logo, pageId, userId) VALUES (?, ?, ?)';
        await connection.query(navbarSql, [logoUrl, pageId, userId]);
        console.log(`Inserted into navbar for page ID: ${pageId}`);

        await connection.commit();
        console.log('Transaction committed successfully');
        res.status(200).send('Navbar data inserted successfully');
    } catch (error) {
        await connection.rollback();
        logger.error(`Error during navbar insertion transaction: ${error.message}`);
        console.error('Error during navbar insertion transaction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};









const insertFooter = async (req, res) => {
    console.log('Received insertFooter request');
    const { userId } = req.body; // Ensure userId is being used
    const file = req.file;

    if (!file) {
        console.log('No logo file uploaded');
        return res.status(400).json({ error: 'No logo file uploaded' });
    }

    const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    console.log(`Generated logo URL: ${logoUrl}`);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction started');

        const [pageResult] = await connection.query('SELECT id FROM pages WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
        const pageId = pageResult.length > 0 ? pageResult[0].id : null;

        if (!pageId) {
            console.log('No page found for the user');
            return res.status(404).json({ error: 'No page found for the user' });
        }

        const footerSql = 'INSERT INTO footer (logo, pageId, userId) VALUES (?, ?, ?)';
        await connection.query(footerSql, [logoUrl, pageId, userId]);
        console.log(`Inserted into footer for page ID: ${pageId}`);

        await connection.commit();
        console.log('Transaction committed successfully');
        res.status(200).send('Footer data inserted successfully');
    } catch (error) {
        await connection.rollback();
        logger.error(`Error during footer insertion transaction: ${error.message}`);
        console.error('Error during footer insertion transaction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};
const uploadAboutImage = async (req, res) => {
    console.log('Received uploadAboutImage request');
    const file = req.file;

    console.log('File received:', file);

    if (!file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    console.log('Image URL set to:', imageUrl);

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
};
const saveAboutSection = async (req, res) => {
    console.log('Received saveAboutSection request');
    const { title, content, userId, imageUrl } = req.body;

    console.log('Data received:', req.body);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction started');

        const [pageResult] = await connection.query('SELECT id FROM pages WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
        const pageId = pageResult.length > 0 ? pageResult[0].id : null;

        if (!pageId) {
            console.log('No page found for the user');
            return res.status(404).json({ error: 'No page found for the user' });
        }

        console.log('Page ID found:', pageId);

        const aboutSql = 'INSERT INTO about_sections (title, content, imageUrl, pageId, userId) VALUES (?, ?, ?, ?, ?)';
        const [insertResult] = await connection.query(aboutSql, [title, content, imageUrl, pageId, userId]);
        console.log(`Inserted into about_sections for page ID: ${pageId}, Insert ID: ${insertResult.insertId}`);

        await connection.commit();
        console.log('Transaction committed successfully');
        res.status(200).json({ message: 'About section data inserted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error during about section insertion transaction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

const uploadServiceImage = async (req, res) => {
    console.log('Received uploadServiceImage request');
    const file = req.file;

    console.log('File received:', file);

    if (!file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imgUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    console.log('Image URL set to:', imgUrl);

    res.status(200).json({ message: 'Image uploaded successfully', imgUrl });
};

const saveService = async (req, res) => {
    console.log('Received saveService request');
    const { title, content, userId, imgUrl } = req.body;

    console.log('Data received:', req.body);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction started');

        const [pageResult] = await connection.query('SELECT id FROM pages WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
        const pageId = pageResult.length > 0 ? pageResult[0].id : null;

        if (!pageId) {
            console.log('No page found for the user');
            return res.status(404).json({ error: 'No page found for the user' });
        }

        console.log('Page ID found:', pageId);

        const serviceSql = 'INSERT INTO services (title, content, imgUrl, pageId, userId) VALUES (?, ?, ?, ?, ?)';
        const [insertResult] = await connection.query(serviceSql, [title, content, imgUrl, pageId, userId]);
        console.log(`Inserted into services for page ID: ${pageId}, Insert ID: ${insertResult.insertId}`);

        await connection.commit();
        console.log('Transaction committed successfully');
        res.status(200).send('Service data inserted successfully');
    } catch (error) {
        await connection.rollback();
        console.error('Error during service insertion transaction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};




const insertTeamMember = async (req, res) => {
    console.log('Received insertTeamMember request');
    const { name, role, userId } = req.body;
    const file = req.file;

    let imgUrl = '';
    if (file) {
        imgUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction started');

        // Get the latest page ID for the user
        const [pageResult] = await connection.query('SELECT id FROM pages WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
        const pageId = pageResult.length > 0 ? pageResult[0].id : null;

        if (!pageId) {
            console.log('No page found for the user');
            return res.status(404).json({ error: 'No page found for the user' });
        }

        console.log('Page ID found:', pageId);

        const memberSql = 'INSERT INTO team_members (name, role, img, pageId, userId) VALUES (?, ?, ?, ?, ?)';
        await connection.query(memberSql, [name, role, imgUrl, pageId, userId]);
        console.log(`Inserted into team_members for page ID: ${pageId}`);

        await connection.commit();
        console.log('Transaction committed successfully');
        res.status(200).send('Team member data inserted successfully');
    } catch (error) {
        await connection.rollback();
        console.error('Error during team member insertion transaction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};


const insertTeamInfo = async (req, res) => {
    console.log('Received insertTeamInfo request');
    const { title, description, userId } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction started');

        // Get the latest page ID for the user
        const [pageResult] = await connection.query('SELECT id FROM pages WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
        const pageId = pageResult.length > 0 ? pageResult[0].id : null;

        if (!pageId) {
            console.log('No page found for the user');
            return res.status(404).json({ error: 'No page found for the user' });
        }

        console.log('Page ID found:', pageId);

        const teamInfoSql = 'INSERT INTO team_info (title, description, pageId, userId) VALUES (?, ?, ?, ?)';
        await connection.query(teamInfoSql, [title, description, pageId, userId]);
        console.log(`Inserted into team_info for page ID: ${pageId}`);

        await connection.commit();
        console.log('Transaction committed successfully');
        res.status(200).send('Team info data inserted successfully');
    } catch (error) {
        await connection.rollback();
        console.error('Error during team info insertion transaction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};



// New controllers for handling pages
const createPage = async (req, res) => {
    const { title, userId } = req.body;
    const url = `/${title.trim().replace(/\s+/g, '-')}`;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const pageSql = 'INSERT INTO pages (title, url, userId) VALUES (?, ?, ?)';
        const [result] = await connection.query(pageSql, [title, url, userId]);
        const pageId = result.insertId;

        await connection.commit();
        res.status(201).json({ id: pageId, title, url });
    } catch (error) {
        await connection.rollback();
        logger.error(`Error during page creation transaction: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};




const fetchAllPages = async (req, res) => {
    try {
        console.log('Fetching all pages');
        const connection = await pool.getConnection();
        const pagesSql = 'SELECT * FROM pages';
        const [pages] = await connection.query(pagesSql);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const results = [];

        for (const page of pages) {
            const pageId = page.id;

            // Fetch Navbar Data
            const [navbar] = await connection.query('SELECT * FROM navbar WHERE pageId = ?', [pageId]);

            // Fetch About Sections Data
            const [aboutSections] = await connection.query('SELECT * FROM about_sections WHERE pageId = ?', [pageId]);

            // Fetch Services Data
            const [services] = await connection.query('SELECT * FROM services WHERE pageId = ?', [pageId]);

            // Fetch Feedbacks Data
            const [feedbacks] = await connection.query('SELECT * FROM feedbacks WHERE pageId = ?', [pageId]);

            // Fetch Team Members Data
            const [teamMembers] = await connection.query('SELECT * FROM team_members WHERE pageId = ?', [pageId]);

            // Fetch Team Info Data
            const [teamInfo] = await connection.query('SELECT * FROM team_info WHERE pageId = ?', [pageId]);

            // Fetch Footer Data
            const [footer] = await connection.query('SELECT * FROM footer WHERE pageId = ?', [pageId]);

            // Constructing the URLs for images
            if (navbar.length > 0) {
                navbar[0].logo = `${baseUrl}/uploads/${navbar[0].logo}`;
            }

            aboutSections.forEach(section => {
                section.imageUrl = section.imageUrl ? `${baseUrl}/uploads/${section.imageUrl}` : null;
            });

            services.forEach(service => {
                service.imgUrl = service.imgUrl ? `${baseUrl}/uploads/${service.imgUrl}` : null;
            });

            feedbacks.forEach(feedback => {
                feedback.imgUrl = feedback.imgUrl ? `${baseUrl}/uploads/${feedback.imgUrl}` : null;
            });

            teamMembers.forEach(member => {
                member.img = member.img ? `${baseUrl}/uploads/${member.img}` : null;
            });

            if (teamInfo.length > 0) {
                teamInfo[0].imgUrl = `${baseUrl}/uploads/${teamInfo[0].imgUrl}`;
            }

            if (footer.length > 0) {
                footer[0].logo = `${baseUrl}/uploads/${footer[0].logo}`;
            }

            results.push({
                page,
                navbar: navbar[0] || null,
                aboutSections,
                services,
                feedbacks,
                teamMembers,
                teamInfo: teamInfo[0] || null,
                footer: footer[0] || null,
            });
        }

        connection.release();
        logger.info('Fetched all pages and their components');
        console.log('Fetched all pages and their components:', results);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('Error fetching pages:', error);
        logger.error(`Error fetching pages: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const fetchPageById = async (req, res) => {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query('SELECT * FROM pages WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const page = results[0];
        const pageId = page.id;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const [navbar] = await connection.query('SELECT * FROM navbar WHERE pageId = ?', [pageId]);
        const [aboutSections] = await connection.query('SELECT * FROM about_sections WHERE pageId = ?', [pageId]);
        const [services] = await connection.query('SELECT * FROM services WHERE pageId = ?', [pageId]);
        const [feedbacks] = await connection.query('SELECT * FROM feedbacks WHERE pageId = ?', [pageId]);
        const [teamMembers] = await connection.query('SELECT * FROM team_members WHERE pageId = ?', [pageId]);
        const [teamInfo] = await connection.query('SELECT * FROM team_info WHERE pageId = ?', [pageId]);
        const [footer] = await connection.query('SELECT * FROM footer WHERE pageId = ?', [pageId]);

        // Constructing the URLs for images
        if (navbar.length > 0) {
            navbar[0].logo = `${baseUrl}/uploads/${navbar[0].logo}`;
        }

        aboutSections.forEach(section => {
            section.imageUrl = section.imageUrl ? `${baseUrl}/uploads/${section.imageUrl}` : null;
        });

        services.forEach(service => {
            service.imgUrl = service.imgUrl ? `${baseUrl}/uploads/${service.imgUrl}` : null;
        });

        feedbacks.forEach(feedback => {
            feedback.imgUrl = feedback.imgUrl ? `${baseUrl}/uploads/${feedback.imgUrl}` : null;
        });

        teamMembers.forEach(member => {
            member.img = member.img ? `${baseUrl}/uploads/${member.img}` : null;
        });

        if (teamInfo.length > 0) {
            teamInfo[0].imgUrl = `${baseUrl}/uploads/${teamInfo[0].imgUrl}`;
        }

        if (footer.length > 0) {
            footer[0].logo = `${baseUrl}/uploads/${footer[0].logo}`;
        }

        const result = {
            page,
            navbar: navbar[0] || null,
            aboutSections,
            services,
            feedbacks,
            teamMembers,
            teamInfo: teamInfo[0] || null,
            footer: footer[0] || null,
        };

        console.log('Fetched page by ID:', result);
        res.json(result);
    } catch (error) {
        logger.error(`Error fetching page: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

const fetchPagesByUserId = async (req, res) => {
    const { userId } = req.params;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query('SELECT * FROM pages WHERE userId = ?', [userId]);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const pages = [];

        for (const page of results) {
            const pageId = page.id;

            const [navbar] = await connection.query('SELECT * FROM navbar WHERE pageId = ?', [pageId]);
            const [aboutSections] = await connection.query('SELECT * FROM about_sections WHERE pageId = ?', [pageId]);
            const [services] = await connection.query('SELECT * FROM services WHERE pageId = ?', [pageId]);
            const [feedbacks] = await connection.query('SELECT * FROM feedbacks WHERE pageId = ?', [pageId]);
            const [teamMembers] = await connection.query('SELECT * FROM team_members WHERE pageId = ?', [pageId]);
            const [teamInfo] = await connection.query('SELECT * FROM team_info WHERE pageId = ?', [pageId]);
            const [footer] = await connection.query('SELECT * FROM footer WHERE pageId = ?', [pageId]);

            // Constructing the URLs for images
            if (navbar.length > 0) {
                navbar[0].logo = `${baseUrl}/uploads/${navbar[0].logo}`;
            }

            aboutSections.forEach(section => {
                section.imageUrl = section.imageUrl ? `${baseUrl}/uploads/${section.imageUrl}` : null;
            });

            services.forEach(service => {
                service.imgUrl = service.imgUrl ? `${baseUrl}/uploads/${service.imgUrl}` : null;
            });

            feedbacks.forEach(feedback => {
                feedback.imgUrl = feedback.imgUrl ? `${baseUrl}/uploads/${feedback.imgUrl}` : null;
            });

            teamMembers.forEach(member => {
                member.img = member.img ? `${baseUrl}/uploads/${member.img}` : null;
            });

            if (teamInfo.length > 0) {
                teamInfo[0].imgUrl = `${baseUrl}/uploads/${teamInfo[0].imgUrl}`;
            }

            if (footer.length > 0) {
                footer[0].logo = `${baseUrl}/uploads/${footer[0].logo}`;
            }

            pages.push({
                page,
                navbar: navbar[0] || null,
                aboutSections,
                services,
                feedbacks,
                teamMembers,
                teamInfo: teamInfo[0] || null,
                footer: footer[0] || null,
            });
        }

        console.log('Fetched pages by user ID:', pages);
        res.json(pages);
    } catch (error) {
        logger.error(`Error fetching pages: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

module.exports = {
    fetchPagesByUserId,
    insertNavbar,
    insertFooter,
    uploadAboutImage,
    saveAboutSection,
    uploadServiceImage,
    saveService,
    insertTeamMember,
    insertTeamInfo,
    createPage,
    fetchAllPages,
    fetchPageById,
};
