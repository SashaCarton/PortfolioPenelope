const express = require('express');
const app = express();
app.use(express.json());

let projects = [];

app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const newProject = { id: Date.now(), ...req.body };
    projects.push(newProject);
    res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...req.body };
        res.json(projects[index]);
    } else {
        res.status(404).send('Projet non trouvé');
    }
});

app.delete('/api/projects/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    projects = projects.filter(p => p.id !== id);
    res.status(204).send();
});

app.listen(3000, () => console.log('Backend en écoute sur http://localhost:3000'));