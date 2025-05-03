<template>
  <div class="admin">
    <h1>Gestion des Projets et Messages</h1>

    <!-- Onglets -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">
        Projets
      </button>
      <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">
        Messages
      </button>
    </div>

    <!-- Projets -->
    <div v-if="activeTab === 'projects'">
      <div v-if="isEditing" class="edit-banner">
        <p>✏️ Modification du projet : <strong>{{ form.title }}</strong></p>
        <button @click="resetForm" class="btn-cancel">Annuler</button>
      </div>

      <form @submit.prevent="handleSubmit" class="project-form">
        <!-- champs du formulaire… -->
      </form>

      <hr/>

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
          <!-- image de couverture -->
          <img :src="project.image" :alt="project.title" />
          <ul class="tags-list" v-if="project.tags.length">
            <li v-for="tag in project.tags" :key="tag" class="tag-item">{{ tag }}</li>
          </ul>
          <a v-if="project.link" :href="project.link" target="_blank" class="project-link">
            Voir le projet
          </a>
        </li>
      </ul>
    </div>

    <!-- Messages -->
    <div v-if="activeTab === 'messages'">
      <h2>Messages reçus</h2>
      <ul class="message-list">
        <li v-for="msg in messages" :key="msg.id" class="message-item">
          <div class="message-header">
            <h3>{{ msg.name }} ({{ msg.email }})</h3>
            <button @click="deleteMessage(msg.id)" class="btn-danger">Supprimer</button>
          </div>
          <p>{{ msg.message }}</p>
          <small>Reçu le : {{ new Date(msg.date).toLocaleString() }}</small>
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
  if (!token) router.push('/login');
});
</script>

<script>
import axios from 'axios';

export default {
  name: 'AdminProjects',
  data() {
    return {
      activeTab: 'projects',
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
        // 1. Récupère la réponse Strapi
        const res = await axios.get('http://localhost:1337/api/projets?populate=Cover');
        // 2. La liste est dans res.data.data
        const raw = res.data.data;
        // 3. Transforme chaque projet
        this.projects = raw.map(p => ({
          id: p.id,
          title: p.Titre,
          description: p.Description,
          link: p.Lien || '',
          tags: [], // à remplir si tu ajoutes un champ tags
          // on choisit la version small si dispo, sinon l'URL brute
          image: p.Cover?.formats?.small?.url
            ? `http://localhost:1337${p.Cover.formats.small.url}`
            : p.Cover?.url
            ? `http://localhost:1337${p.Cover.url}`
            : '',
        }));
      } catch (err) {
        console.error('Erreur lors de la récupération des projets :', err);
      }
    },

    async fetchMessages() {
      try {
        const res = await axios.get('http://localhost:3000/api/messages');
        this.messages = res.data;
      } catch (err) {
        console.error('Erreur lors de la récupération des messages :', err);
      }
    },

    async deleteMessage(id) {
      try {
        await axios.delete(`http://localhost:3000/api/messages/${id}`);
        this.messages = this.messages.filter(m => m.id !== id);
      } catch (err) {
        console.error('Erreur lors de la suppression du message :', err);
      }
    },

    handleImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.image = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },
    handleMediaUpload(e) {
      this.previewMedia = Array.from(e.target.files).map(f => ({
        type: f.type,
        preview: URL.createObjectURL(f),
      }));
    },

    async handleSubmit() {
      // ta logique de création/modification ici
    },
    resetForm() {
      this.form = { id: null, title: '', description: '', link: '', image: null, tags: '' };
      this.isEditing = false;
      this.previewImage = null;
      this.previewMedia = [];
      document.getElementById('image').value = '';
      document.getElementById('media').value = '';
    },
    editProject(proj) {
      this.form = {
        id: proj.id,
        title: proj.title,
        description: proj.description,
        link: proj.link,
        image: null,
        tags: proj.tags.join(', '),
      };
      this.isEditing = true;
      this.previewImage = proj.image;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async deleteProject(id) {
      try {
        await axios.delete(`http://localhost:3000/api/projects/${id}`);
        this.projects = this.projects.filter(p => p.id !== id);
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
/* … ton CSS inchangé … */
</style>
