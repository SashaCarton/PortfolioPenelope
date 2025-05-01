<template>
    <div class="admin">
      <h1>Gestion des Projets</h1>
  
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
          <a :href="project.link" target="_blank" class="project-link" v-if="project.link">
            Voir le projet
          </a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'AdminProjects',
    data() {
      return {
        projects: [],
        form: { id: null, title: '', description: '', link: '' },
        isEditing: false,
      }
    },
    methods: {
      // 1) Charger tous les projets
      async fetchProjects() {
        try {
          const { data } = await axios.get('/api/projects')
          this.projects = data
        } catch (err) {
          console.error('Erreur fetchProjects:', err)
        }
      },
  
      // 2) Création ou mise à jour
      async handleSubmit() {
        try {
          if (this.isEditing) {
            // Modifier
            const { data } = await axios.put(
              `/api/projects/${this.form.id}`,
              this.form
            )
            // remplacer dans la liste
            const idx = this.projects.findIndex(p => p.id === data.id)
            if (idx !== -1) this.$set(this.projects, idx, data)
          } else {
            // Créer
            const { data } = await axios.post('/api/projects', this.form)
            this.projects.push(data)
          }
          this.resetForm()
        } catch (err) {
          console.error('Erreur handleSubmit:', err)
        }
      },
  
      // 3) Préparer le formulaire pour édition
      editProject(project) {
        this.form = { ...project }
        this.isEditing = true
      },
  
      // 4) Supprimer
      async deleteProject(id) {
        try {
          await axios.delete(`/api/projects/${id}`)
          this.projects = this.projects.filter(p => p.id !== id)
        } catch (err) {
          console.error('Erreur deleteProject:', err)
        }
      },
  
      // Réinitialisation
      resetForm() {
        this.form = { id: null, title: '', description: '', link: '' }
        this.isEditing = false
      },
    },
    mounted() {
      this.fetchProjects()
    },
  }
  </script>
  
  <style scoped>
  /* (garde ton style violet/blanc existant) */
  .admin {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem 2rem;
    background: #fff;
    color: #6a4b8a;
    font-family: 'Helvetica Neue', sans-serif;
  }
  /* … le reste de ton CSS … */
  </style>
  