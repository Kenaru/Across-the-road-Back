const db = require('../config/db');

exports.addWebsitePage = async (req, res) => {
    const { imports, components, formData } = req.body;
    try {
        console.log("Received request to add website page:", { imports, components, formData });
        
        const result = await db.query('INSERT INTO websitePages (imports, formData) VALUES (?, ?)', [JSON.stringify(imports), JSON.stringify(formData)]);
        const pageId = result.insertId;
        console.log("Website page added successfully. Page ID:", pageId);
        
        await addPageComponents(pageId, components);
        console.log("Page components added successfully for page ID:", pageId);
        
        res.json({ pageId });
    } catch (error) {
        console.error("Error adding website page:", error);
        res.status(500).send('Error adding website page');
    }
};

async function addPageComponents(pageId, components) {
    try {
        console.log("Adding page components for page ID:", pageId);
        
        for (const component of components) {
            await db.query('INSERT INTO pageComponents (pageId, componentType, content, componentData) VALUES (?, ?, ?, ?)',
                [pageId, component.type, component.content, JSON.stringify(component.component)]);
        }
        console.log("Page components added successfully for page ID:", pageId);
    } catch (error) {
        console.error("Error adding page components:", error);
        throw error;
    }
}

exports.getWebsitePage = async (req, res) => {
    const { pageId } = req.params;
    try {
        console.log("Received request to get website page. Page ID:", pageId);
        
        const [pageData] = await db.query('SELECT * FROM websitePages WHERE id = ?', [pageId]);
        if (pageData.length === 0) {
            throw new Error('Page not found');
        }
        console.log("Retrieved website page data successfully. Page ID:", pageId);
        
        const [imports] = await db.query('SELECT import FROM pageImports WHERE pageId = ?', [pageId]);
        const [components] = await db.query('SELECT * FROM pageComponents WHERE pageId = ?', [pageId]);

        const formattedComponents = components.map(component => ({
            id: component.id,
            component: JSON.parse(component.componentData),
            content: component.content,
            type: component.componentType
        }));
        console.log("Formatted website page components successfully. Page ID:", pageId);
        
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
