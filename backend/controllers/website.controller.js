const db = require('../config/db');

exports.addWebsitePage = async (req, res) => {
    const { imports, components, formData } = req.body;
    try {
        const result = await db.query('INSERT INTO websitePages (imports, formData) VALUES (?, ?)', [JSON.stringify(imports), JSON.stringify(formData)]);
        const pageId = result.insertId;
        await addPageComponents(pageId, components);
        res.json({ pageId });
    } catch (error) {
        console.error("Error adding website page:", error);
        res.status(500).send('Error adding website page');
    }
};

async function addPageComponents(pageId, components) {
    try {
        for (const component of components) {
            await db.query('INSERT INTO pageComponents (pageId, componentType, content, componentData) VALUES (?, ?, ?, ?)',
                [pageId, component.type, component.content, JSON.stringify(component.component)]);
        }
    } catch (error) {
        console.error("Error adding page components:", error);
        throw error;
    }
}

exports.getWebsitePage = async (req, res) => {
    const { pageId } = req.params;
    try {
        const [pageData] = await db.query('SELECT * FROM websitePages WHERE id = ?', [pageId]);
        if (pageData.length === 0) {
            throw new Error('Page not found');
        }

        const [imports] = await db.query('SELECT import FROM pageImports WHERE pageId = ?', [pageId]);
        const [components] = await db.query('SELECT * FROM pageComponents WHERE pageId = ?', [pageId]);

        const formattedComponents = components.map(component => ({
            id: component.id,
            component: JSON.parse(component.componentData),
            content: component.content,
            type: component.componentType
        }));

        res.json({
            id: pageData[0].id,
            imports: imports.map(imp => imp.import),
            components: formattedComponents,
            formData: pageData[0].formData
        });
    } catch (error) {
        console.error("Error getting website page:", error);
        res.status(500).send('Error getting website page');
    }
};
