const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.forgotpassword = async (req, res) => {
  const db = require('../config/db');
    const { mail, confirmmail } = req.body;

    try {
        // Vérification des adresses e-mail et correspondance
        if (!mail || !mail.trim()) {
            return res.status(400).json({ success: false, message: 'Adresse e-mail invalide' });
        }

        if (mail !== confirmmail) {
            return res.status(400).json({ success: false, message: 'Les adresses e-mail ne correspondent pas' });
        }

        // Vérification que l'adresse e-mail existe dans la base de données
        const userExists = await checkUserExists(mail);

        if (!userExists) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        // Génération du token de réinitialisation
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Stockage du token dans la base de données avec expiration (par exemple, 1 heure)
        await db.query('UPDATE Users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE mail = ?', [resetToken, mail]);

        // Construisez le lien de réinitialisation avec le token
        const resetLink = `http://127.0.0.1:5500/frontend/Home/Connexion/reset-password/reset-password.html?token=${resetToken}`;

        // Envoyez l'e-mail de réinitialisation
        const transporter = nodemailer.createTransport({
            host: 'jojoba.o2switch.net', // Adresse du serveur SMTP (exemple pour Gmail)
            port: 587, // Port du serveur SMTP (587 pour TLS, 465 pour SSL)
            secure: false, // true pour 465, false pour d'autres ports
            auth: {
                user: 'ne-pas-repondre@acrosstheroad.fr', // Votre adresse e-mail
                pass: '!_NPR_AcrossTheRoad_2023!Mail_!', // Votre mot de passe
            },
            tls: {
                rejectUnauthorized: false, // Nécessaire si votre serveur SMTP utilise un certificat auto-signé
            },
        });


        await transporter.sendMail({
            from: 'ne-pas-repondre@acrosstheroad.fr',
            to: mail,
            subject: 'Réinitialisation de mot de passe',
            text: ``,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="fr">
             <head>
              <meta charset="UTF-8">
              <meta content="width=device-width, initial-scale=1" name="viewport">
              <meta name="x-apple-disable-message-reformatting">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta content="telephone=no" name="format-detection">
              <title>Empty template</title><!--[if (mso 16)]>
                <style type="text/css">
                a {text-decoration: none;}
                </style>
                <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG></o:AllowPNG>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]--><!--[if !mso]><!-- -->
              <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i"><!--<![endif]-->
              <style type="text/css">
            .rollover:hover .rollover-first {
              max-height:0px!important;
              display:none!important;
              }
              .rollover:hover .rollover-second {
              max-height:none!important;
              display:inline-block!important;
              }
              .rollover div {
              font-size:0px;
              }
              u + .body img ~ div div {
              display:none;
              }
              #outlook a {
              padding:0;
              }
              span.MsoHyperlink,
            span.MsoHyperlinkFollowed {
              color:inherit;
              mso-style-priority:99;
              }
              a.es-button {
              mso-style-priority:100!important;
              text-decoration:none!important;
              }
              a[x-apple-data-detectors] {
              color:inherit!important;
              text-decoration:none!important;
              font-size:inherit!important;
              font-family:inherit!important;
              font-weight:inherit!important;
              line-height:inherit!important;
              }
              .es-desk-hidden {
              display:none;
              float:left;
              overflow:hidden;
              width:0;
              max-height:0;
              line-height:0;
              mso-hide:all;
              }
              .es-button-border:hover > a.es-button {
              color:#ffffff!important;
              }
              td .es-button-border:hover a.es-button-8096 {
              color:#000!important;
              }
            @media only screen and (max-width:600px) {.es-m-p0r { padding-right:0px!important } .es-m-p20b { padding-bottom:20px!important } .es-m-p20b { padding-bottom:20px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0r { padding-right:0px!important } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:18px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } }
            </style>
             </head>
             <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
              <div dir="ltr" class="es-wrapper-color" lang="fr" style="background-color:#F6F6F6"><!--[if gte mso 9]>
                  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#f6f6f6"></v:fill>
                  </v:background>
                <![endif]-->
               <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                 <tr>
                  <td valign="top" style="padding:0;Margin:0">
                   <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                     <tr>
                      <td align="center" style="padding:0;Margin:0">
                       <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px"><!--[if mso]><table style="width:560px" cellpadding="0"
                                        cellspacing="0"><tr><td style="width:180px" valign="top"><![endif]-->
                           <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                             <tr>
                              <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:180px">
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://ecrwmeb.stripocdn.email/content/guids/CABINET_4187db5353a4bdb573f80bfe1026a074e8c8594a86a0f32ccbc8ba520d276ea9/images/across_the_road.png" alt="" width="180" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table><!--[if mso]></td><td style="width:20px"></td><td style="width:360px" valign="top"><![endif]-->
                           <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                             <tr>
                              <td align="left" style="padding:0;Margin:0;width:360px">
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;letter-spacing:0;color:#000000;font-size:14px"><strong><u>Réinitialisation de votre mot de passe ​</u></strong></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;letter-spacing:0;color:#000000;font-size:14px">​</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;letter-spacing:0;color:#000000;font-size:14px">&nbsp;Ce Mail vous <u>permet de réinitialiser votre mot de passe</u> ! Si vous n'êtes <u>pas l'auteur de cette demande,</u> veuillez contacter un responsable de votre association ou alors contacter le support de <strong>Across The Road</strong> au plus vite</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;letter-spacing:0;color:#000000;font-size:14px">​</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;letter-spacing:0;color:#000000;font-size:14px">Sinon suivez les étapes de réinitialisation</p></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table><!--[if mso]></td></tr></table><![endif]--></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table>
                   <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                     <tr>
                      <td align="center" style="padding:0;Margin:0">
                       <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                         <tr>
                          <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                           <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                             <tr>
                              <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="${resetLink}" target="_blank" hidden>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="${resetLink}" 
                            style="height:41px; v-text-anchor:middle; width:275px" arcsize="50%" strokecolor="#000000" strokeweight="2px" fillcolor="#ffffff">
                <w:anchorlock></w:anchorlock>
                <center style='color:#000000; font-family:roboto, "helvetica neue", helvetica, arial, sans-serif; font-size:15px; font-weight:700; line-height:15px;  mso-text-raise:1px'>Réinitialiser le Mot de passe</center>
              </v:roundrect></a>
            <![endif]--><!--[if !mso]><!-- --><span class="es-button-border msohide" style="border-style:solid;border-color:#000000;background:#ffffff;border-width:2px;display:inline-block;border-radius:50px;width:auto;mso-hide:all"><a href="http://127.0.0.1:5500/frontend/Home/Connexion/reset-password/reset-password.html?token=${resetToken}" class="es-button es-button-8096" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#000;font-size:18px;padding:10px 20px 10px 20px;display:inline-block;background:#ffffff;border-radius:50px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #ffffff">Réinitialiser le Mot de passe</a></span><!--<![endif]--></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table>
                   <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                     <tr>
                      <td align="center" style="padding:0;Margin:0">
                       <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                         <tr>
                          <td align="left" style="Margin:0;padding-top:20px;padding-right:20px;padding-left:20px;padding-bottom:20px"><!--[if mso]><table style="width:560px" cellpadding="0" 
                                    cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                           <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                             <tr>
                              <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td align="center" style="padding:0;Margin:0;font-size:0">
                                   <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                     <tr>
                                      <td align="center" valign="top" class="es-m-p0r" style="padding:0;Margin:0;padding-right:15px"><img title="Facebook" src="https://ecrwmeb.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png" alt="Fb" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                      <td align="center" valign="top" class="es-m-p0r" style="padding:0;Margin:0;padding-right:15px"><img title="X.com" src="https://ecrwmeb.stripocdn.email/content/assets/img/social-icons/logo-colored/x-logo-colored.png" alt="X" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                      <td align="center" valign="top" style="padding:0;Margin:0"><img title="Instagram" src="https://ecrwmeb.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png" alt="Ig" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                     </tr>
                                   </table></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table><!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                           <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                             <tr>
                              <td align="left" style="padding:0;Margin:0;width:270px">
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr>
                                  <td style="padding:0;Margin:0">
                                   <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                     <tr class="links">
                                      <td align="center" valign="top" width="33.33%" style="padding:0;Margin:0;border:0;padding-top:10px;padding-bottom:10px"><a target="_blank" href="https://acrosstheroad.fr" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#000000;font-size:14px">se connecter</a></td>
                                      <td align="center" valign="top" width="33.33%" style="padding:0;Margin:0;border:0;padding-top:10px;padding-bottom:10px"><a target="_blank" href="https://acrosstheroad.fr/register" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#000000;font-size:14px">s'enregistrer</a></td>
                                      <td align="center" valign="top" width="33.33%" style="padding:0;Margin:0;border:0;padding-top:10px;padding-bottom:10px"><a target="_blank" href="https://acrosstheroad/support" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#000000;font-size:14px">support</a></td>
                                     </tr>
                                   </table></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table><!--[if mso]></td></tr></table><![endif]--></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table>
              </div>
             </body>
            </html>`,
        });

        res.status(200).json({ success: true, message: 'E-mail de réinitialisation envoyé avec succès' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

async function checkUserExists(mail) {
    const db = require('../config/db');
    const result = await db.query('SELECT COUNT(*) AS count FROM Users WHERE mail = ?', [mail]);
    return result[0][0].count > 0; // Accéder correctement à la valeur de count
}

const db = require('../config/db');

exports.reset_password = async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    // Regex pour vérifier le mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#°.£¤µ,?\\§;!ù%²$=%^~'\-`\/\[\]&*()_+{}|:<>?]).{8,}$/;

    try {
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: 'Le mot de passe doit faire au moins 8 caractères et contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas' });
        }

        const user = await db.query('SELECT * FROM Users WHERE reset_token = ?', [token]);

        if (!user || user.length === 0 || user[0].reset_token_expires < new Date()) {
            return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
        }

        // Hacher le mot de passe avec SHA-256
        const hashedPassword = hashPassword(password);

        await db.query('UPDATE Users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashedPassword, user[0][0].id]);

        res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

// Fonction pour hacher le mot de passe avec SHA-256
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

