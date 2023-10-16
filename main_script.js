const { exec } = require('child_process');
const express = require('express');

const app = express();

app.get('/create_container', (req, res) => {
    exec('docker run -itd --name main_container debian', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la commande : ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Conteneur créé avec succès');
    });
});

app.listen(3000, () => {
    console.log('Le serveur est en écoute sur le port 3000');
});
