const { exec } = require('child_process');
const express = require('express');
const crypto = require('crypto');

const app = express();

let containers = {};

app.get('/create_container', (req, res) => {
    const id = req.query.id;
    const token = id ? id : crypto.randomBytes(8).toString('hex');
  
    if (containers[token]) {
        res.send('Déjà présent');
    } else {
        const containerName = `container_${token}`;
        containers[token] = true;

        exec(`docker run -itd --name ${containerName} debian`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la commande : ${error}`);
                res.send('Une erreur s\'est produite lors de la création du conteneur');
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res.send(`Conteneur ${containerName} créé avec succès. ID : ${token}`);
        });
    }
});

app.listen(3000, () => {
    console.log('Le serveur est en écoute sur le port 3000');
});
