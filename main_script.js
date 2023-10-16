const express = require('express');
const app = express();
const { Docker } = require('dockerode');
const docker = new Docker();
const url = require('url');

app.get('/create_container', (req, res) => {
    const id = url.parse(req.url).hash ? url.parse(req.url).hash.substring(1) : undefined;
    if (id) {
        docker.listContainers({ all: true }, function (err, containers) {
            if (err) {
                res.send('Une erreur s\'est produite lors de la recherche du conteneur.');
            } else {
                const exists = containers.some(container => container.Names.includes(`/${id}`));
                if (exists) {
                    res.send(`Le conteneur avec l'ID ${id} existe déjà.`);
                } else {
                    res.send(`Le conteneur avec l'ID ${id} n'existe pas.`);
                }
            }
        });
    } else {
        res.send('Veuillez spécifier un ID de conteneur dans l\'URL.');
    }
});

app.listen(3000, () => {
    console.log('Le serveur est en écoute sur le port 3000');
});
