<template>
  <div class="admin">
    <h1>Gestion des Projets et Messages</h1>

    <!-- Onglets pour basculer entre Projets et Messages -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">Projets</button>
      <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">Messages</button>
    </div>

    <!-- Contenu des Projets -->
    <div v-if="activeTab === 'projects'">
      <!-- Indicateur de mode édition pour les projets -->
      <div v-if="isEditing" class="edit-banner">
        <p>✏️ Modification du projet : <strong>{{ form.title }}</strong></p>
        <button @click="resetForm" class="btn-cancel">Annuler</button>
      </div>

      <!-- Formulaire pour créer ou modifier un projet -->
      <form @submit.prevent="handleSubmit" class="project-form">
        <div class="form-group">
          <label for="title">Titre</label>
          <input type="text" id="title" v-model="form.title" required />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="form.description" required></textarea>
        </div>
        <div class="form-group">
          <label for="link">Lien</label>
          <input type="url" id="link" v-model="form.link" />
        </div>
        <div class="form-group">
          <label for="image">Image</label>
          <input type="file" id="image" @change="handleImageUpload" />
          <img v-if="previewImage" :src="previewImage" alt="Aperçu de l'image" class="preview-image" />
        </div>
        <div class="form-group">
          <label for="media">Médias (images/vidéos)</label>
          <input type="file" id="media" multiple @change="handleMediaUpload" />
          <div class="media-preview">
            <div v-for="(file, index) in previewMedia" :key="index" class="media-item">
              <img v-if="file.type.startsWith('image/')" :src="file.preview" :alt="`Image ${index + 1}`" />
              <video v-else controls>
                <source :src="file.preview" :type="file.type" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="tags">Tags (séparés par des virgules)</label>
          <input type="text" id="tags" v-model="form.tags" placeholder="Exemple : Graphisme, Branding, Logo" />
        </div>
        <button type="submit" class="btn-primary">
          {{ isEditing ? 'Modifier' : 'Créer' }} le projet
        </button>
      </form>

      <hr />

      <!-- Liste des projets existants -->
      <h2>Projets existants</h2>
      <ul class="project-list">
        <li v-for="project in projects" :key="project.id" class="project-item">
          <div class="project-header">
            <h3>{{ project.title }}</h3>
            <div class="project-actions">
              <button @click="editProject(project)" class="btn-secondary">Modifier</button>
              <button @click="deleteProject(project.id)" class="btn-danger">Supprimer</button>
            </div>
          </div>
          <p>{{ project.description }}</p>
          <img :src="`http://localhost:3000${project.image}`" :alt="project.title" />
          <ul class="tags-list" v-if="project.tags && project.tags.length">
            <li v-for="tag in project.tags" :key="tag" class="tag-item">{{ tag }}</li>
          </ul>
          <a :href="project.link" target="_blank" class="project-link" v-if="project.link">
            Voir le projet
          </a>
        </li>
      </ul>
    </div>

    <!-- Contenu des Messages -->
    <div v-if="activeTab === 'messages'">
      <h2>Messages reçus</h2>
      <ul class="message-list">
        <li v-for="message in messages" :key="message.id" class="message-item">
          <div class="message-header">
            <h3>{{ message.name }} ({{ message.email }})</h3>
            <button @click="deleteMessage(message.id)" class="btn-danger">Supprimer</button>
          </div>
          <p>{{ message.message }}</p>
          <small>Reçu le : {{ new Date(message.date).toLocaleString() }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    router.push('/login'); // Redirige vers la page de connexion si non authentifié
  }
});
</script>

<script>
import axios from 'axios';

export default {
  name: 'AdminProjects',
  data() {
    return {
      activeTab: 'projects', // Onglet actif par défaut
      projects: [],
      messages: [],
      form: { id: null, title: '', description: '', link: '', image: null, tags: '' },
      isEditing: false,
      previewImage: null,
      previewMedia: [],
    };
  },
  methods: {
    async fetchProjects() {
      try {
        const { data } = await axios.get('http://localhost:3000/api/projects');
        this.projects = data;
      } catch (err) {
        console.error('Erreur lors de la récupération des projets :', err);
      }
    },

    async fetchMessages() {
      try {
        const { data } = await axios.get('http://localhost:3000/api/messages');
        this.messages = data;
      } catch (err) {
        console.error('Erreur lors de la récupération des messages :', err);
      }
    },

    async deleteMessage(id) {
      console.log('Tentative de suppression du message avec ID :', id); // Log pour vérifier l'ID
      try {
        const response = await axios.delete(`/api/messages/${id.toString()}`); // Conversion explicite de l'ID en chaîne
        if (response.status === 204) {
          this.messages = this.messages.filter(m => m.id !== id);
          console.log('Message supprimé avec succès'); // Log pour succès
        } else {
          console.error('Erreur inattendue lors de la suppression du message');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression du message :', err);
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.image = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },

    handleMediaUpload(event) {
      const files = event.target.files;
      this.previewMedia = Array.from(files).map(file => ({
        type: file.type,
        preview: URL.createObjectURL(file),
      }));
    },

    async handleSubmit() {
      try {
        const formData = new FormData();
        formData.append('title', this.form.title);
        formData.append('description', this.form.description);
        formData.append('link', this.form.link);
        formData.append('tags', this.form.tags.split(',').map(tag => tag.trim()).join(','));
        if (this.form.image) {
          formData.append('image', this.form.image);
        }
        if (this.previewMedia.length) {
          this.previewMedia.forEach((file, index) => {
            formData.append(`media_${index}`, file);
          });
        }

        if (this.isEditing) {
          const { data } = await axios.put(
            `http://localhost:3000/api/projects/${this.form.id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          const index = this.projects.findIndex(p => p.id === data.id);
          if (index !== -1) this.projects.splice(index, 1, data);
        } else {
          const { data } = await axios.post('http://localhost:3000/api/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          this.projects.push(data);
        }
        this.resetForm();
      } catch (err) {
        console.error('Erreur lors de l\'envoi du formulaire :', err);
      }
    },

    resetForm() {
      this.form = { id: null, title: '', description: '', link: '', image: null, tags: '' };
      this.isEditing = false;
      this.previewImage = null;
      this.previewMedia = [];
      const imageInput = document.getElementById('image');
      if (imageInput) {
        imageInput.value = '';
      }
      const mediaInput = document.getElementById('media');
      if (mediaInput) {
        mediaInput.value = '';
      }
    },

    editProject(project) {
      this.form = {
        ...project,
        tags: project.tags ? project.tags.join(', ') : '',
        image: null,
      };
      this.isEditing = true;
      this.previewImage = `http://localhost:3000${project.image}`;
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Défilement vers le haut
    },

    async deleteProject(id) {
      console.log('Tentative de suppression du projet avec ID :', id); // Log pour vérifier l'ID
      try {
        await axios.delete(`http://localhost:3000/api/projects/${id}`);
        this.projects = this.projects.filter(p => p.id !== id);
        console.log('Projet supprimé avec succès'); // Log pour succès
      } catch (err) {
        console.error('Erreur lors de la suppression du projet :', err);
      }
    },
  },
  mounted() {
    this.fetchProjects();
    this.fetchMessages();
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin {
  animation: fadeIn 0.8s ease-in-out;
}

.admin {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background: #fff;
  color: #6a4b8a;
  font-family: 'Helvetica Neue', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.tabs button {
  background: none;
  border: 1px solid #6a4b8a;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  color: #6a4b8a;
  text-transform: uppercase;
  font-weight: 300;
}

.tabs button.active {
  background: #6a4b8a;
  color: white;
}

.edit-banner {
  background-color: #fff3cd;
  color: #856404;
  padding: 1rem;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-cancel {
  background: #aaa;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #888;
}

.project-form {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4a4a4a;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #6a4b8a;
  outline: none;
  box-shadow: 0 0 4px rgba(106, 75, 138, 0.5);
}

.preview-image {
  margin-top: 0.5rem;
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.media-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.media-item img,
.media-item video {
  max-width: 100%;
  width: 50%;
  height: auto;
  border-radius: 4px;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #6a4b8a;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-primary:hover {
  background: #563d6e;
}

.project-list {
  list-style: none;
  padding: 0;
}

.project-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-actions button {
  margin-left: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}
.btn-secondary {
  background: #4b306a;
  color: #fff;
}
.btn-secondary:hover {
  background: #3a2b5c;
}
.btn-danger {
  background: #d9534f;
  color: #fff;
}
.btn-danger:hover {
  background: #c9302c;
}

.project-link:hover {
  text-decoration: underline;
  color: #4b306a;
  transition: color 0.3s ease;
}

img {
  max-width: 100%;
  width: 50%;
  height: auto;
  border-radius: 4px;
}

.tags-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
}
.tag-item {
  background: #6a4b8a;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.message-list {
  list-style: none;
  padding: 0;
}

.message-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
