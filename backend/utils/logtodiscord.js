const fetch = require('node-fetch');
const moment = require('moment-timezone');

function sendLogToDiscord(event, userInfo) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('URL du webhook Discord non définie dans les variables d\'environnement.');
        return;
    }

    const dateTimeParis = moment().tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss');
    const embed = {
        title: `${event}`,
        color: 3447003, // Couleur de l'embed, en décimal
        fields: [
            { name: 'Date et Heure (Paris)', value: dateTimeParis, inline: false },
            // Ajouter d'autres champs ici
        ],
        timestamp: new Date()
    };

    for (const [key, value] of Object.entries(userInfo)) {
        embed.fields.push({ name: key, value: value.toString(), inline: true });
    }

    // Envoyer le message au webhook Discord
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [embed]
        })
    })
    .then(response => {
        if (!response.ok) {
            console.error('Erreur lors de l\'envoi du log à Discord:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la connexion au webhook Discord:', error);
    });
}

module.exports = sendLogToDiscord;
