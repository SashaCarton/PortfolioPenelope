<template>
  <section class="analytics">
    <div class="analytics-header">
      <h1>📊 Analytics</h1>
      <div class="period-selector">
        <button
          v-for="p in periods"
          :key="p.value"
          :class="['period-btn', { active: selectedDays === p.value }]"
          @click="loadStats(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des statistiques...</p>
    </div>

    <!-- Erreur d'auth -->
    <div v-else-if="error" class="error-card">
      <h2>🔒 Accès refusé</h2>
      <p>{{ error }}</p>
      <button @click="router.push('/login')" class="btn">Se connecter</button>
    </div>

    <!-- Dashboard -->
    <template v-else-if="stats">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-icon">👁️</span>
          <div class="kpi-value">{{ stats.totalVisites }}</div>
          <div class="kpi-label">Pages vues</div>
          <div class="kpi-sub">{{ selectedDays }} derniers jours</div>
        </div>
        <div class="kpi-card">
          <span class="kpi-icon">👤</span>
          <div class="kpi-value">{{ stats.sessionsUniques }}</div>
          <div class="kpi-label">Visiteurs uniques</div>
        </div>
        <div class="kpi-card">
          <span class="kpi-icon">⏱️</span>
          <div class="kpi-value">{{ formatDuration(stats.dureeMoyenne) }}</div>
          <div class="kpi-label">Durée moyenne</div>
        </div>
        <div class="kpi-card perf-card">
          <span class="kpi-icon">⚡</span>
          <div class="kpi-value" :class="lcpColor">{{ formatMs(stats.performance?.lcp) }}</div>
          <div class="kpi-label">LCP moyen</div>
        </div>
      </div>

      <!-- Graphique des visites par jour -->
      <div class="chart-card">
        <h2>📈 Visites par jour</h2>
        <div class="bar-chart">
          <div
            v-for="(day, index) in chartDays"
            :key="index"
            class="bar-column"
          >
            <div class="bar-value">{{ day.count }}</div>
            <div
              class="bar"
              :style="{ height: barHeight(day.count) + '%' }"
            ></div>
            <div class="bar-label">{{ day.label }}</div>
          </div>
        </div>
      </div>

      <!-- Grille de détails -->
      <div class="details-grid">
        <!-- Pages populaires -->
        <div class="detail-card">
          <h2>📄 Pages populaires</h2>
          <div class="ranking-list">
            <div
              v-for="(item, i) in stats.parPage.slice(0, 10)"
              :key="item[0]"
              class="ranking-item"
            >
              <span class="rank">#{{ i + 1 }}</span>
              <span class="ranking-name">{{ formatPage(item[0]) }}</span>
              <div class="ranking-bar-container">
                <div
                  class="ranking-bar"
                  :style="{ width: rankPercent(item[1], stats.totalVisites) + '%' }"
                ></div>
              </div>
              <span class="ranking-count">{{ item[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Appareils -->
        <div class="detail-card">
          <h2>📱 Appareils</h2>
          <div class="donut-container">
            <div class="donut-list">
              <div
                v-for="(item, i) in stats.parDevice"
                :key="item[0]"
                class="donut-item"
              >
                <span class="donut-dot" :style="{ background: colors[i % colors.length] }"></span>
                <span class="donut-label">{{ deviceLabel(item[0]) }}</span>
                <span class="donut-value">{{ percent(item[1], stats.totalVisites) }}%</span>
                <span class="donut-count">({{ item[1] }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigateurs -->
        <div class="detail-card">
          <h2>🌐 Navigateurs</h2>
          <div class="ranking-list">
            <div
              v-for="(item, i) in stats.parBrowser.slice(0, 8)"
              :key="item[0]"
              class="ranking-item"
            >
              <span class="rank">#{{ i + 1 }}</span>
              <span class="ranking-name">{{ item[0] }}</span>
              <div class="ranking-bar-container">
                <div
                  class="ranking-bar browser-bar"
                  :style="{
                    width: rankPercent(item[1], stats.totalVisites) + '%',
                    background: colors[i % colors.length]
                  }"
                ></div>
              </div>
              <span class="ranking-count">{{ item[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Systèmes d'exploitation -->
        <div class="detail-card">
          <h2>💻 Systèmes</h2>
          <div class="donut-list">
            <div
              v-for="(item, i) in stats.parOS"
              :key="item[0]"
              class="donut-item"
            >
              <span class="donut-dot" :style="{ background: colors[i % colors.length] }"></span>
              <span class="donut-label">{{ item[0] }}</span>
              <span class="donut-value">{{ percent(item[1], stats.totalVisites) }}%</span>
              <span class="donut-count">({{ item[1] }})</span>
            </div>
          </div>
        </div>

        <!-- Sources de trafic -->
        <div class="detail-card">
          <h2>🔗 Sources de trafic</h2>
          <div class="ranking-list">
            <div
              v-for="(item, i) in stats.parReferrer.slice(0, 8)"
              :key="item[0]"
              class="ranking-item"
            >
              <span class="rank">#{{ i + 1 }}</span>
              <span class="ranking-name">{{ item[0] }}</span>
              <div class="ranking-bar-container">
                <div
                  class="ranking-bar referrer-bar"
                  :style="{ width: rankPercent(item[1], stats.totalVisites) + '%' }"
                ></div>
              </div>
              <span class="ranking-count">{{ item[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Pays -->
        <div class="detail-card" v-if="stats.parPays && stats.parPays.length">
          <h2>🌍 Pays</h2>
          <div class="ranking-list">
            <div
              v-for="(item, i) in stats.parPays.slice(0, 10)"
              :key="item[0]"
              class="ranking-item"
            >
              <span class="rank">#{{ i + 1 }}</span>
              <span class="ranking-name">{{ countryFlag(item[0]) }} {{ item[0] }}</span>
              <div class="ranking-bar-container">
                <div
                  class="ranking-bar country-bar"
                  :style="{
                    width: rankPercent(item[1], stats.totalVisites) + '%',
                    background: colors[i % colors.length]
                  }"
                ></div>
              </div>
              <span class="ranking-count">{{ item[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Villes -->
        <div class="detail-card" v-if="stats.parVille && stats.parVille.length">
          <h2>🏙️ Villes</h2>
          <div class="ranking-list">
            <div
              v-for="(item, i) in stats.parVille.slice(0, 10)"
              :key="item[0]"
              class="ranking-item"
            >
              <span class="rank">#{{ i + 1 }}</span>
              <span class="ranking-name">{{ item[0] }}</span>
              <div class="ranking-bar-container">
                <div
                  class="ranking-bar city-bar"
                  :style="{
                    width: rankPercent(item[1], stats.totalVisites) + '%',
                    background: colors[(i + 3) % colors.length]
                  }"
                ></div>
              </div>
              <span class="ranking-count">{{ item[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Web Vitals -->
        <div class="detail-card">
          <h2>⚡ Web Vitals</h2>
          <div class="vitals-grid">
            <div class="vital-item">
              <div class="vital-label">LCP</div>
              <div class="vital-value" :class="getVitalColor('lcp', stats.performance?.lcp)">
                {{ formatMs(stats.performance?.lcp) }}
              </div>
              <div class="vital-desc">Largest Contentful Paint</div>
            </div>
            <div class="vital-item">
              <div class="vital-label">FCP</div>
              <div class="vital-value" :class="getVitalColor('fcp', stats.performance?.fcp)">
                {{ formatMs(stats.performance?.fcp) }}
              </div>
              <div class="vital-desc">First Contentful Paint</div>
            </div>
            <div class="vital-item">
              <div class="vital-label">CLS</div>
              <div class="vital-value" :class="getVitalColor('cls', stats.performance?.cls)">
                {{ stats.performance?.cls?.toFixed(3) || '—' }}
              </div>
              <div class="vital-desc">Cumul. Layout Shift</div>
            </div>
            <div class="vital-item">
              <div class="vital-label">TTFB</div>
              <div class="vital-value" :class="getVitalColor('ttfb', stats.performance?.ttfb)">
                {{ formatMs(stats.performance?.ttfb) }}
              </div>
              <div class="vital-desc">Time to First Byte</div>
            </div>
          </div>
          <p class="vitals-count">Basé sur {{ stats.performance?.count || 0 }} mesures</p>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const stats = ref(null);
const selectedDays = ref(30);

const periods = [
  { label: '7j', value: 7 },
  { label: '30j', value: 30 },
  { label: '90j', value: 90 },
];

const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

async function loadStats(days = 30) {
  selectedDays.value = days;
  loading.value = true;
  error.value = null;

  const token = localStorage.getItem('adminToken');
  if (!token) {
    error.value = 'Vous devez être connecté pour accéder aux analytics.';
    loading.value = false;
    return;
  }

  try {
    const res = await fetch(
      `https://api.penelopeletienne.ovh/api/visites/stats?days=${days}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 401 || res.status === 403) {
      error.value = 'Session expirée. Veuillez vous reconnecter.';
      loading.value = false;
      return;
    }

    if (!res.ok) throw new Error('Erreur serveur');

    const { data } = await res.json();
    stats.value = data;
  } catch (e) {
    error.value = 'Impossible de charger les statistiques.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => loadStats(30));

// --- Chart data ---
const chartDays = computed(() => {
  if (!stats.value?.parJour) return [];
  const days = [];
  const now = new Date();

  for (let i = selectedDays.value - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().substring(0, 10);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    days.push({
      date: dateStr,
      label,
      count: stats.value.parJour[dateStr] || 0,
    });
  }

  // En mode 90j, regrouper par semaine pour lisibilité
  if (selectedDays.value > 30) {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      const chunk = days.slice(i, i + 7);
      const total = chunk.reduce((s, d) => s + d.count, 0);
      weeks.push({ date: chunk[0].date, label: chunk[0].label, count: total });
    }
    return weeks;
  }

  return days;
});

const maxDayCount = computed(() => Math.max(...chartDays.value.map(d => d.count), 1));

function barHeight(count) {
  return (count / maxDayCount.value) * 100;
}

// --- Formatters ---
function formatDuration(seconds) {
  if (!seconds) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatMs(ms) {
  if (!ms && ms !== 0) return '—';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatPage(page) {
  if (page === '/') return 'Accueil';
  return page.replace(/^\//, '').replace(/-/g, ' ');
}

function percent(count, total) {
  if (!total) return '0';
  return ((count / total) * 100).toFixed(1);
}

function rankPercent(count, total) {
  if (!total) return 0;
  return (count / total) * 100;
}

function deviceLabel(d) {
  const map = { desktop: '🖥️ Desktop', mobile: '📱 Mobile', tablet: '📋 Tablet', unknown: '❓ Inconnu' };
  return map[d] || d;

}

/** Convertit un code ISO pays (ex: "FR") en emoji drapeau */
function countryFlag(code) {
  if (!code || code === 'Inconnu' || code.length !== 2) return '🌐';
  const offset = 127397;
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + offset));
}

const lcpColor = computed(() => {
  const lcp = stats.value?.performance?.lcp;
  if (!lcp) return '';
  if (lcp < 2500) return 'vital-good';
  if (lcp < 4000) return 'vital-ok';
  return 'vital-bad';
});

function getVitalColor(metric, value) {
  if (!value && value !== 0) return '';
  const thresholds = {
    lcp: [2500, 4000],
    fcp: [1800, 3000],
    cls: [0.1, 0.25],
    ttfb: [800, 1800],
  };
  const [good, ok] = thresholds[metric] || [0, 0];
  if (value <= good) return 'vital-good';
  if (value <= ok) return 'vital-ok';
  return 'vital-bad';
}
</script>

<style scoped>
.analytics {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 2rem 4rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.analytics-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1.5px solid #e2e2e2;
  border-radius: 30px;
  background: #fff;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.period-btn:hover {
  border-color: #000;
}

.period-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: box-shadow 0.2s ease;
}

.kpi-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.kpi-icon {
  font-size: 1.5rem;
}

.kpi-value {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0.3rem 0;
}

.kpi-label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-sub {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.3rem;
}

/* Bar Chart */
.chart-card {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 200px;
  padding-top: 1rem;
}

.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.bar-value {
  font-size: 0.65rem;
  color: #999;
  margin-bottom: 4px;
}

.bar {
  width: 100%;
  max-width: 40px;
  background: linear-gradient(180deg, #4f46e5, #6366f1);
  border-radius: 4px 4px 0 0;
  min-height: 2px;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 0.6rem;
  color: #999;
  margin-top: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1rem;
}

.detail-card {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 1.5rem;
}

.detail-card h2 {
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Ranking Lists */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.rank {
  color: #999;
  font-size: 0.75rem;
  min-width: 24px;
}

.ranking-name {
  min-width: 80px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranking-bar-container {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.ranking-bar {
  height: 100%;
  background: #4f46e5;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.referrer-bar { background: #10b981; }

.ranking-count {
  color: #666;
  font-size: 0.8rem;
  min-width: 30px;
  text-align: right;
}

/* Donut / Distribution */
.donut-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.donut-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.donut-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.donut-label {
  flex: 1;
}

.donut-value {
  font-weight: 600;
  min-width: 45px;
  text-align: right;
}

.donut-count {
  color: #999;
  font-size: 0.75rem;
}

/* Web Vitals */
.vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.vital-item {
  text-align: center;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.vital-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.vital-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.3rem 0;
}

.vital-desc {
  font-size: 0.65rem;
  color: #999;
}

.vital-good { color: #10b981; }
.vital-ok { color: #f59e0b; }
.vital-bad { color: #ef4444; }

.vitals-count {
  font-size: 0.75rem;
  color: #999;
  text-align: center;
  margin-top: 1rem;
}

/* Loading & Error */
.loading {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-card {
  text-align: center;
  padding: 4rem 2rem;
  background: #fafafa;
  border-radius: 16px;
  border: 1px solid #eee;
}

.error-card h2 {
  margin-bottom: 1rem;
}

.btn {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
}

.btn:hover {
  background: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .analytics {
    padding: 80px 1rem 2rem;
  }

  .analytics-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .bar-chart {
    height: 150px;
  }

  .bar-label {
    display: none;
  }

  .vitals-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
