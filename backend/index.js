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
app.use(express.json()); // Analyse les données JSON
app.use(express.urlencoded({ extended: true })); // Analyse les données URL-encoded

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

// Modification de la configuration de multer pour gérer plusieurs fichiers
const uploadMultiple = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
        if (!allowedTypes.includes(file.mimetype)) {
            console.error(`Type de fichier non supporté : ${file.mimetype}`);
            return cb(new Error('Type de fichier non supporté'), false);
        }
        console.log(`Fichier accepté : ${file.originalname}`);
        cb(null, true);
    },
    limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50 Mo
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
const messagesFilePath = path.join(__dirname, '/data/messages.json'); // Chemin vers le fichier JSON des messages

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

// Fonction pour lire les messages depuis le fichier JSON
function readMessages() {
    if (!fs.existsSync(messagesFilePath)) {
        fs.writeFileSync(messagesFilePath, JSON.stringify([])); // Crée un fichier vide si inexistant
    }
    const data = fs.readFileSync(messagesFilePath, 'utf-8');
    try {
        return JSON.parse(data) || []; // Retourne un tableau vide si le contenu est invalide
    } catch (error) {
        console.error('Erreur de parsing du fichier messages.json :', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

// Fonction pour écrire les messages dans le fichier JSON
function writeMessages(messages) {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
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

// Endpoint pour récupérer un projet par ID avec ses médias
app.get('/api/projects/:id', (req, res) => {
    try {
        const projects = readProjects();
        const id = parseInt(req.params.id, 10);
        const project = projects.find(p => p.id === id);

        if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé.' });
        }

        res.json(project);
    } catch (error) {
        console.error('Erreur lors de la récupération du projet :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// Endpoint pour créer un projet avec plusieurs fichiers
app.post('/api/projects', uploadMultiple.array('media', 10), (req, res) => {
    try {
        console.log('Requête reçue pour créer un projet');
        const projects = readProjects();
        const { title, description, link, tags } = req.body;

        const mediaFiles = req.files.map(file => ({
            filename: file.filename,
            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        }));

        const newProject = {
            id: Date.now(),
            title: title || 'Sans titre',
            description: description || '',
            link: link && link !== 'undefined' ? link : '',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            media: mediaFiles,
        };

        projects.push(newProject);
        writeProjects(projects);

        res.status(201).json(newProject);
    } catch (error) {
        console.error('Erreur lors de la création du projet :', error);
        res.status(500).send('Erreur interne du serveur');
    }
});

// Correction de la logique pour enregistrer correctement les médias
app.put('/api/projects/:id', uploadMultiple.array('media', 10), (req, res) => {
    try {
        const projects = readProjects();
        const id = parseInt(req.params.id, 10);
        const index = projects.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).send('Projet non trouvé');
        }

        const { title, description, link, tags } = req.body;

        // Ajouter les nouveaux fichiers médias
        const mediaFiles = req.files.map(file => ({
            filename: file.filename,
            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        }));

        // Conserver les médias existants et ajouter les nouveaux
        const updatedMedia = projects[index].media ? [...projects[index].media, ...mediaFiles] : mediaFiles;

        projects[index] = {
            ...projects[index],
            title: title || projects[index].title, // Conserver la valeur existante si absente
            description: description || projects[index].description,
            link: link && link !== 'undefined' ? link : projects[index].link, // Remplace "undefined" par la valeur existante ou une chaîne vide
            tags: tags ? tags.split(',').map(tag => tag.trim()) : projects[index].tags, // Conserver les tags existants si absents
            media: updatedMedia,
        };

        writeProjects(projects);

        res.json(projects[index]);
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

// Endpoint pour gérer les soumissions du formulaire de contact
app.post('/api/contact', (req, res) => {
    console.log('Requête reçue sur /api/contact'); // Log pour confirmer l'appel de l'endpoint
    try {
        const { name, email, message } = req.body;

        // Validation des champs
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            console.error('Validation échouée : Nom invalide.');
            return res.status(400).json({ error: 'Le champ "Nom" est requis et doit être valide.' });
        }
        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.error('Validation échouée : Email invalide.');
            return res.status(400).json({ error: 'Le champ "Email" est requis et doit être une adresse email valide.' });
        }
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            console.error('Validation échouée : Message invalide.');
            return res.status(400).json({ error: 'Le champ "Message" est requis et doit être valide.' });
        }

        // Nettoyage des entrées utilisateur
        const sanitizedMessage = message.replace(/<[^>]*>?/gm, ''); // Supprime les balises HTML

        // Lire les messages existants
        const messages = readMessages();

        // Ajouter le nouveau message
        const newMessage = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            message: sanitizedMessage.trim(),
            date: new Date().toISOString(),
        };
        messages.push(newMessage);

        // Enregistrer les messages mis à jour
        writeMessages(messages);

        console.log('Nouveau message enregistré :', newMessage);

        // Réponse de succès
        res.status(200).json({ message: 'Votre message a été envoyé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire de contact :', error.message);
        res.status(500).json({ error: `Erreur interne du serveur : ${error.message}` });
    }
});

// Endpoint pour récupérer tous les messages
app.get('/api/messages', (req, res) => {
    try {
        const messages = readMessages();
        res.json(messages);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// Endpoint pour supprimer un message
app.delete('/api/messages/:id', (req, res) => {
    try {
        const messages = readMessages();
        const id = req.params.id; // Utiliser l'ID tel quel (chaîne de caractères)
        const messageIndex = messages.findIndex(m => m.id.toString() === id); // Comparer en tant que chaîne

        if (messageIndex === -1) {
            return res.status(404).json({ error: 'Message non trouvé.' });
        }

        // Supprimer le message
        messages.splice(messageIndex, 1);
        writeMessages(messages);

        res.status(204).send(); // Réponse sans contenu
    } catch (error) {
        console.error('Erreur lors de la suppression du message :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// Endpoint pour gérer les requêtes GET sur /api/contact
app.get('/api/contact', (req, res) => {
    res.status(405).json({ error: "Méthode non autorisée. Utilisez une requête POST pour soumettre le formulaire." });
});

// Chemin vers le fichier JSON contenant les utilisateurs
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Endpoint pour l'authentification
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Lire les utilisateurs depuis le fichier JSON
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Vérifier si l'utilisateur existe et si le mot de passe correspond
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        return res.json({ success: true, token: 'admin-token' }); // Retourne un token fictif
    }

    res.status(401).json({ success: false, message: 'Identifiants invalides' });
});

app.listen(3000, () => console.log('Backend en écoute sur http://localhost:3000'));