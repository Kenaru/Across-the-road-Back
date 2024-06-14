const pool = require('../config/db');
const path = require('../config/upload')

// Helper function to save component data
async function saveComponentData(pageId, userId, data, tableName, fields) {
    const fieldNames = fields.join(', ');
    const placeholders = fields.map(() => '?').join(', ');
    const values = data.map((item) => fields.map((field) => item[field]));
    const query = `INSERT INTO ${tableName} (${fieldNames}, page_id, user_id) VALUES (${placeholders}, ?, ?)`;

    for (const value of values) {
        await pool.query(query, [...value, pageId, userId]);
    }
}

const createPage = async (req, res) => {
    const { title, url, userId, componentsData } = req.body;
    const { files } = req;
    console.log('createPage called with:', req.body);
    console.log('Uploaded files:', files);

    try {

        const [existingPage] = await pool.query('SELECT * FROM pages WHERE url = ?', [url]);
        if (existingPage.length > 0) {
            return res.status(400).json({ error: 'Page with the same URL already exists' });
        }

        console.log('Starting the process to create a new page');
        const [result] = await pool.query(
            'INSERT INTO pages (title, url, user_id) VALUES (?, ?, ?)',
            [title, url, userId]
        );

        const pageId = result.insertId;
        console.log('Page created successfully with ID:', pageId);

        if (componentsData) {
            if (componentsData.navbar) {
                const logoUrl = files && files['navbar_logo'] ? `/uploads/${files['navbar_logo'][0].filename}` : null;
                const navbarData = { ...componentsData.navbar, logo_url: logoUrl };
                console.log('Saving navbar component data:', navbarData);
                await saveComponentData(pageId, userId, [navbarData], 'navbars', ['logo_url']);
            }

            if (componentsData.aboutSections) {
                const aboutSections = componentsData.aboutSections.map((section, index) => {
                    const imageUrl = files && files[`about_image`] && files[`about_image`][index] ? `/uploads/${files[`about_image`][index].filename}` : null;
                    return { ...section, image_url: imageUrl };
                });
                console.log('Saving about sections component data:', aboutSections);
                await saveComponentData(pageId, userId, aboutSections, 'about_sections', ['title', 'content', 'image_url']);
            }

            if (componentsData.services) {
                const services = componentsData.services.map((service, index) => {
                    const imageUrl = files && files[`service_image`] && files[`service_image`][index] ? `/uploads/${files[`service_image`][index].filename}` : null;
                    return { ...service, img_url: imageUrl };
                });
                console.log('Saving services component data:', services);
                await saveComponentData(pageId, userId, services, 'services', ['title', 'content', 'img_url']);
            }

            if (componentsData.feedbacks) {
                const feedbacks = componentsData.feedbacks.map((feedback, index) => {
                    const imageUrl = files && files[`feedback_image`] && files[`feedback_image`][index] ? `/uploads/${files[`feedback_image`][index].filename}` : null;
                    return { ...feedback, img_url: imageUrl };
                });
                console.log('Saving feedbacks component data:', feedbacks);
                await saveComponentData(pageId, userId, feedbacks, 'feedbacks', ['content', 'name', 'role', 'img_url']);
            }

            if (componentsData.teamMembers) {
                const teamMembers = componentsData.teamMembers.members.map((member, index) => {
                    const imageUrl = files && files[`team_image`] && files[`team_image`][index] ? `/uploads/${files[`team_image`][index].filename}` : null;
                    return { ...member, img_url: imageUrl };
                });
                console.log('Saving team members component data:', teamMembers);
                await saveComponentData(pageId, userId, teamMembers, 'team_members', ['name', 'role', 'img_url']);

                const teamInfo = componentsData.teamMembers.info;
                await saveComponentData(pageId, userId, [teamInfo], 'team_info', ['title', 'description']);
            }

            if (componentsData.footer) {
                const footerData = componentsData.footer;
                console.log('Saving footer component data:', footerData);
                await saveComponentData(pageId, userId, [footerData], 'footers', ['content']);
            }

        } else {
            console.log('No componentsData provided');
        }

        console.log('All component data saved successfully');
        res.status(201).json({ id: pageId, message: 'Page created successfully' });
    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).json({ error: 'Failed to create page' });
    }
};



const updatePage = async (req, res) => {
    const { id } = req.params;
    const { title, url, userId, componentsData } = req.body;
    const { files } = req;
    console.log(`updatePage called with id ${id}:`, req.body);
    try {
        const query = 'UPDATE pages SET title = ?, url = ?, user_id = ? WHERE id = ?';
        console.log(`Executing query: ${query} with values: ${[title, url, userId, id]}`);
        await pool.query(query, [title, url, userId, id]);
        console.log('Page updated successfully:', id);

        const componentTables = ['navbars', 'about_sections', 'services', 'feedbacks', 'team_members', 'footers'];
        for (const table of componentTables) {
            const deleteQuery = `DELETE FROM ${table} WHERE page_id = ?`;
            console.log(`Executing query: ${deleteQuery} with value: ${id}`);
            await pool.query(deleteQuery, [id]);
        }

        if (componentsData) {
            if (componentsData.navbar) {
                const logoUrl = files && files['navbar_logo'] ? `/uploads/${files['navbar_logo'][0].filename}` : null;
                const navbarData = { ...componentsData.navbar, logo_url: logoUrl };
                console.log('Saving navbar component data:', navbarData);
                await saveComponentData(id, userId, [navbarData], 'navbars', ['logo_url']);
            }

            if (componentsData.aboutSections) {
                const aboutSections = componentsData.aboutSections.map((section, index) => {
                    const imageUrl = files && files[`about_image_${index}`] ? `/uploads/${files[`about_image_${index}`][0].filename}` : null;
                    return { ...section, image_url: imageUrl };
                });
                console.log('Saving about sections component data:', aboutSections);
                await saveComponentData(id, userId, aboutSections, 'about_sections', ['title', 'content', 'image_url']);
            }

            if (componentsData.services) {
                const services = componentsData.services.map((service, index) => {
                    const imageUrl = files && files[`service_image_${index}`] ? `/uploads/${files[`service_image_${index}`][0].filename}` : null;
                    return { ...service, img_url: imageUrl };
                });
                console.log('Saving services component data:', services);
                await saveComponentData(id, userId, services, 'services', ['title', 'content', 'img_url']);
            }

            if (componentsData.feedbacks) {
                const feedbacks = componentsData.feedbacks.map((feedback, index) => {
                    const imageUrl = files && files[`feedback_image_${index}`] ? `/uploads/${files[`feedback_image_${index}`][0].filename}` : null;
                    return { ...feedback, img_url: imageUrl };
                });
                console.log('Saving feedbacks component data:', feedbacks);
                await saveComponentData(id, userId, feedbacks, 'feedbacks', ['content', 'name', 'role', 'img_url']);
            }

            if (componentsData.teamMembers) {
                const teamMembers = componentsData.teamMembers.map((member, index) => {
                    const imageUrl = files && files[`team_image_${index}`] ? `/uploads/${files[`team_image_${index}`][0].filename}` : null;
                    return { ...member, img_url: imageUrl };
                });
                console.log('Saving team members component data:', teamMembers);
                await saveComponentData(id, userId, teamMembers, 'team_members', ['name', 'role', 'img_url']);
            }

            if (componentsData.footer) {
                const imageUrl = files && files['footer_image'] ? `/uploads/${files['footer_image'][0].filename}` : null;
                const footerData = { ...componentsData.footer, image_url: imageUrl };
                console.log('Saving footer component data:', footerData);
                await saveComponentData(id, userId, [footerData], 'footers', ['content', 'image_url']);
            }
        } else {
            console.log('No componentsData provided');
        }

        res.status(200).json({ message: 'Page updated successfully' });
    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).json({ error: 'Failed to update page' });
    }
};

const fetchPageById = async (req, res) => {
    const { id } = req.params;
    console.log(`fetchPageById called with id ${id}`);
    try {
        const query = 'SELECT * FROM pages WHERE id = ?';
        console.log(`Executing query: ${query} with value: ${id}`);
        const [pageResult] = await pool.query(query, [id]);
        const pageData = pageResult[0];
        console.log('Fetched page:', pageData);

        const [navbarResult] = await pool.query('SELECT * FROM navbars WHERE page_id = ?', [id]);
        const [aboutSectionsResult] = await pool.query('SELECT * FROM about_sections WHERE page_id = ?', [id]);
        const [servicesResult] = await pool.query('SELECT * FROM services WHERE page_id = ?', [id]);
        const [feedbacksResult] = await pool.query('SELECT * FROM feedbacks WHERE page_id = ?', [id]);
        const [teamMembersResult] = await pool.query('SELECT * FROM team_members WHERE page_id = ?', [id]);
        const [footerResult] = await pool.query('SELECT * FROM footers WHERE page_id = ?', [id]);

        const componentsData = {
            navbar: navbarResult[0],
            aboutSections: aboutSectionsResult,
            services: servicesResult,
            feedbacks: feedbacksResult,
            teamMembers: teamMembersResult,
            footer: footerResult[0]
        };

        res.status(200).json({ ...pageData, componentsData });
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
};

module.exports = {
    createPage,
    updatePage,
    fetchPageById
};
