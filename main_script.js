const { exec } = require('child_process');
const { execSync } = require('child_process'); // Ajout de l'importation pour execSync
const express = require('express');
const crypto = require('crypto');

const app = express();

app.get('/create_container', (req, res) => {
    const token = crypto.randomBytes(8).toString('hex');
    const containerName = req.query.id ? req.query.id : `container_${token}`;
    const containerExists = checkContainerExists(containerName);

    if (containerExists) {
        restartContainer(containerName);
        res.send(`Redémarrage du conteneur ${containerName}`);
    } else {
        exec(`docker run -itd --name ${containerName} debian`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la commande : ${error}`);
                res.send('Une erreur s\'est produite lors de la création du conteneur');
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res.send(`Conteneur ${containerName} créé avec succès`);
        });
    }
});

function checkContainerExists(containerName) {
    const result = execSync(`docker ps -aqf "name=${containerName}"`);
    return result.length > 0;
}

function restartContainer(containerName) {
    exec(`docker restart ${containerName}`);
}

app.listen(3000, () => {
    console.log('Le serveur est en écoute sur le port 3000');
});
