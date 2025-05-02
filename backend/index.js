const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

// Vérifiez que le dossier "uploads" existe, sinon créez-le
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Configuration de multer pour enregistrer les fichiers dans le dossier "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Utilisez le chemin absolu
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom unique pour chaque fichier
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            console.error(`Type de fichier non supporté : ${file.mimetype}`); // Log pour type non supporté
            return cb(new Error('Type de fichier non supporté'), false);
        }
        console.log(`Fichier accepté : ${file.originalname}`); // Log pour fichier accepté
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 Mo
});

// Middleware pour gérer les erreurs de multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error(`Erreur Multer : ${err.message}`); // Log pour erreur multer
        return res.status(400).send(`Erreur de téléchargement : ${err.message}`);
    } else if (err) {
        console.error(`Erreur : ${err.message}`); // Log pour autre erreur
        return res.status(400).send(`Erreur : ${err.message}`);
    }
    next();
});

// Servir les fichiers statiques du dossier "uploads"
app.use('/uploads', express.static(uploadsDir));

const filePath = path.join(__dirname, '/data/projects.json'); // Chemin vers le fichier JSON

// Fonction pour lire les projets depuis le fichier JSON
function readProjects() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([])); // Crée un fichier vide si inexistant
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

// Fonction pour écrire les projets dans le fichier JSON
function writeProjects(projects) {
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
}

// Endpoint pour récupérer tous les projets
app.get('/api/projects', (req, res) => {
    const projects = readProjects();
    const updatedProjects = projects.map(project => ({
        ...project,
        image: project.image ? `/uploads/${project.image}` : null, // Assurez-vous que le chemin est correct
    }));
    res.json(updatedProjects);
});

// Endpoint pour créer un projet
app.post('/api/projects', upload.single('image'), (req, res) => {
    try {
        console.log('Requête reçue pour créer un projet'); // Log pour début de requête
        if (req.file) {
            console.log(`Fichier téléchargé : ${req.file.filename}`); // Log pour fichier téléchargé
        } else {
            console.warn('Aucun fichier téléchargé'); // Log si aucun fichier
        }

        const projects = readProjects();
        const { title, description, link, tags } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProject = {
            id: Date.now(),
            title: title || 'Sans titre', // Valeur par défaut si le titre est absent
            description: description || '',
            link: link && link !== 'undefined' ? link : '', // Remplace "undefined" par une chaîne vide
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // Gérer les tags absents
            image,
        };

        projects.push(newProject);
        writeProjects(projects);

        res.status(201).json({
            ...newProject,
            image: newProject.image ? `/uploads/${newProject.image}` : null, // Assurez-vous que le chemin est correct
        });
    } catch (error) {
        console.error('Erreur lors de la création du projet :', error);
        res.status(500).send('Erreur interne du serveur');
    }
});

// Endpoint pour modifier un projet
app.put('/api/projects/:id', upload.single('image'), (req, res) => {
    try {
        const projects = readProjects();
        const id = parseInt(req.params.id, 10);
        const index = projects.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).send('Projet non trouvé');
        }

        const { title, description, link, tags } = req.body;
        const image = req.file ? req.file.filename : projects[index].image;

        projects[index] = {
            ...projects[index],
            title: title || projects[index].title, // Conserver la valeur existante si absente
            description: description || projects[index].description,
            link: link && link !== 'undefined' ? link : projects[index].link, // Remplace "undefined" par la valeur existante ou une chaîne vide
            tags: tags ? tags.split(',').map(tag => tag.trim()) : projects[index].tags, // Conserver les tags existants si absents
            image,
        };

        writeProjects(projects);

        res.json({
            ...projects[index],
            image: projects[index].image ? `/uploads/${projects[index].image}` : null, // Assurez-vous que le chemin est correct
        });
    } catch (error) {
        console.error('Erreur lors de la modification du projet :', error);
        res.status(500).send('Erreur interne du serveur');
    }
});

// Endpoint pour supprimer un projet
app.delete('/api/projects/:id', (req, res) => {
    try {
        const projects = readProjects();
        const id = parseInt(req.params.id, 10);
        const projectToDelete = projects.find(p => p.id === id);

        if (!projectToDelete) {
            return res.status(404).send('Projet non trouvé');
        }

        // Supprimer le fichier image associé, si présent
        if (projectToDelete.image) {
            const imagePath = path.join(uploadsDir, projectToDelete.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const updatedProjects = projects.filter(p => p.id !== id);
        writeProjects(updatedProjects);
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression du projet :', error);
        res.status(500).send('Erreur interne du serveur');
    }
});

app.listen(3000, () => console.log('Backend en écoute sur http://localhost:3000'));