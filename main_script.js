const { exec } = require('child_process');
const express = require('express');
const crypto = require('crypto');

const app = express();

let containers = {};

app.get('/create_container', (req, res) => {
    const token = crypto.randomBytes(8).toString('hex');
    const id = req.query.id;
  
    if (id && containers[id]) {
        res.send('Déjà présent');
    } else {
        const containerName = id ? id : `container_${token}`;
        containers[containerName] = true;

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

app.listen(3000, () => {
    console.log('Le serveur est en écoute sur le port 3000');
});
