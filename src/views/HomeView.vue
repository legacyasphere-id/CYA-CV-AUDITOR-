<template>
  <div class="lp">

    <!-- ══ NAV ══════════════════════════════════════════════════════════ -->
    <nav class="lp-nav" :class="{ 'lp-nav--scrolled': navScrolled }">
      <div class="lp-wrap lp-nav__inner">
        <RouterLink to="/" class="lp-logo">CYA</RouterLink>

        <!-- Desktop links -->
        <div class="lp-nav__links">
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#preview-audit">Preview Audit</a>
          <a href="#faq">FAQ</a>
          <RouterLink to="/audit" class="lp-btn">Audit CV Saya</RouterLink>
        </div>

        <!-- Mobile toggle -->
        <button class="lp-nav__burger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="lp-nav__mobile">
        <a href="#cara-kerja" @click="mobileOpen = false">Cara Kerja</a>
        <a href="#preview-audit" @click="mobileOpen = false">Preview Audit</a>
        <a href="#faq" @click="mobileOpen = false">FAQ</a>
        <RouterLink to="/audit" class="lp-btn" @click="mobileOpen = false">Audit CV Saya</RouterLink>
      </div>
    </nav>

    <!-- ══ HERO ══════════════════════════════════════════════════════════ -->
    <section id="hero" class="lp-hero">
      <div class="lp-wrap lp-hero__inner">

        <!-- Left: Copy -->
        <div class="lp-hero__copy reveal">
          <div class="lp-eyebrow">Audit CV oleh AI Recruiter</div>

          <h1 class="lp-hero__h1">
            Ketahui Apa yang Recruiter Lihat Dalam&nbsp;30&nbsp;Detik&nbsp;Pertama.
          </h1>

          <p class="lp-hero__sub">
            Upload CV Anda dan dapatkan audit yang jujur, spesifik, dan relevan
            dengan posisi yang Anda lamar.
          </p>

          <RouterLink to="/audit" class="lp-btn lp-btn--large lp-btn--green">
            Audit CV Saya — Rp10.000
          </RouterLink>

          <p class="lp-microcopy">Hasil dalam &lt;&nbsp;1 menit &nbsp;•&nbsp; Tanpa registrasi</p>

          <div class="lp-social-proof">
            <div class="lp-avatars">
              <div class="lp-avatar" style="background:#C4996A">Y</div>
              <div class="lp-avatar" style="background:#2A5C45">R</div>
              <div class="lp-avatar" style="background:#7A7368">D</div>
            </div>
            <span>Sudah <strong>200+</strong> pencari kerja mendapat feedback dari CYA</span>
          </div>
        </div>

        <!-- Right: Floating card mockup -->
        <div class="lp-hero__visual reveal" style="animation-delay:0.2s">
          <div class="lp-card-mockup">
            <!-- Card header -->
            <div class="lcm-header">
              <span class="lcm-logo">CYA</span>
              <span class="lcm-badge">Audit Report</span>
            </div>

            <!-- Abstract CV lines -->
            <div class="lcm-cv">
              <div class="lcm-cv__name"></div>
              <div class="lcm-cv__title"></div>
              <div class="lcm-cv__divider"></div>
              <div class="lcm-cv__line" style="width:85%"></div>
              <div class="lcm-cv__line" style="width:100%"></div>
              <div class="lcm-cv__line" style="width:70%"></div>
              <div class="lcm-cv__line" style="width:90%"></div>
            </div>

            <!-- Score -->
            <div class="lcm-score">
              <span class="lcm-score__num">72</span>
              <span class="lcm-score__denom">/100</span>
            </div>

            <!-- Feedback chips -->
            <div class="lcm-chips">
              <div class="lcm-chip lcm-chip--pass">✓ Format Bersih</div>
              <div class="lcm-chip lcm-chip--fail">✗ Tidak Ada Angka</div>
              <div class="lcm-chip lcm-chip--warn">⚠ Summary Lemah</div>
            </div>

            <!-- AI snippet -->
            <div class="lcm-comment">
              "CV ini menunjukkan pengalaman yang relevan, namun kurang menonjolkan pencapaian kuantitatif…"
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ HOW IT WORKS ══════════════════════════════════════════════════ -->
    <section id="cara-kerja" class="lp-section">
      <div class="lp-wrap">
        <div class="lp-section-header reveal">
          <h2 class="lp-h2">Cara Kerja CYA</h2>
          <p class="lp-section-sub">Tiga langkah. Kurang dari dua menit.</p>
        </div>

        <div class="lp-steps">
          <div v-for="(step, i) in steps" :key="i" class="lp-step reveal" :style="`animation-delay:${i * 0.12}s`">
            <div class="lp-step__icon">{{ step.icon }}</div>
            <div class="lp-step__num">{{ i + 1 }}</div>
            <h3 class="lp-step__title">{{ step.title }}</h3>
            <p class="lp-step__desc">{{ step.desc }}</p>
          </div>

          <!-- Dashed connectors (desktop only) -->
          <div class="lp-step-connector lp-step-connector--1" aria-hidden="true"></div>
          <div class="lp-step-connector lp-step-connector--2" aria-hidden="true"></div>
        </div>
      </div>
    </section>

    <!-- ══ AUDIT PREVIEW ══════════════════════════════════════════════════ -->
    <section id="preview-audit" class="lp-section lp-section--tinted">
      <div class="lp-wrap">
        <div class="lp-section-header reveal">
          <h2 class="lp-h2">Seperti Ini Hasil Audit CYA</h2>
          <p class="lp-section-sub">Detail, spesifik, dan langsung bisa dieksekusi.</p>
        </div>

        <div class="lp-preview">
          <!-- Left: abstract CV -->
          <div class="lp-preview__cv reveal">
            <div class="lp-cv-mock">
              <div class="lcv-top">
                <div class="lcv-photo"></div>
                <div class="lcv-info">
                  <div class="lcv-line" style="width:70%; height:10px; background:#3D3A34; border-radius:4px"></div>
                  <div class="lcv-line" style="width:50%; height:7px; margin-top:6px; background:#7A7368; border-radius:4px"></div>
                </div>
              </div>
              <div class="lcv-section-label"></div>
              <div class="lcv-line"></div>
              <div class="lcv-line" style="width:80%"></div>
              <div class="lcv-line" style="width:90%"></div>
              <div class="lcv-section-label" style="margin-top:16px"></div>
              <div class="lcv-line"></div>
              <div class="lcv-line" style="width:65%"></div>
              <div class="lcv-section-label" style="margin-top:16px"></div>
              <div class="lcv-chips">
                <div class="lcv-chip"></div>
                <div class="lcv-chip"></div>
                <div class="lcv-chip"></div>
              </div>
            </div>
          </div>

          <!-- Right: audit result panel -->
          <div class="lp-preview__result reveal" style="animation-delay:0.15s">
            <div class="lp-result-panel">
              <div class="lrp-header">
                <span class="lrp-tag">Kesan Pertama</span>
                <span class="lrp-score">7/10</span>
              </div>
              <p class="lrp-impression">CV sudah rapi dan relevan untuk posisi yang dilamar. Namun beberapa bagian perlu diperkuat agar lebih menonjol.</p>

              <div class="lrp-meter-label">
                <span>Skor Kesiapan</span>
                <strong>72/100</strong>
              </div>
              <div class="lrp-meter-track">
                <div class="lrp-meter-fill" style="width:72%"></div>
              </div>

              <h4 class="lrp-subhead">Kekuatan</h4>
              <ul class="lrp-list lrp-list--pass">
                <li>Pengalaman magang di perusahaan ternama</li>
                <li>Skill teknis sesuai kebutuhan posisi</li>
                <li>Format bersih dan mudah dibaca</li>
              </ul>

              <h4 class="lrp-subhead">Yang Perlu Diperbaiki</h4>
              <ul class="lrp-list lrp-list--fail">
                <li>Tidak ada pencapaian terukur (angka/persentase)</li>
                <li>Summary terlalu generik</li>
                <li>Bagian skill perlu diperbarui</li>
              </ul>

              <RouterLink to="/audit" class="lp-btn lp-btn--green lp-btn--full">
                Audit CV Saya Sekarang
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ COMMON MISTAKES ══════════════════════════════════════════════ -->
    <section class="lp-section">
      <div class="lp-wrap">
        <div class="lp-section-header reveal">
          <h2 class="lp-h2">Kesalahan CV yang Sering Luput</h2>
          <p class="lp-section-sub">CYA mendeteksi ini — rekruter juga.</p>
        </div>

        <div class="lp-mistakes">
          <div
            v-for="(m, i) in mistakes"
            :key="i"
            class="lp-mistake-card reveal"
            :style="`animation-delay:${i * 0.1}s`"
          >
            <div class="lmc-icon">{{ m.icon }}</div>
            <h3 class="lmc-title">{{ m.title }}</h3>
            <p class="lmc-desc">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ PRICING ══════════════════════════════════════════════════════ -->
    <section class="lp-section lp-section--tinted">
      <div class="lp-wrap">
        <div class="lp-pricing-card reveal">
          <div class="lpc-eyebrow">Harga</div>
          <div class="lpc-price">
            <span class="lpc-currency">Rp</span>10.000
          </div>
          <p class="lpc-label">Sekali bayar. Tanpa langganan.</p>

          <ul class="lpc-features">
            <li v-for="f in features" :key="f">
              <span class="lpc-check">✓</span> {{ f }}
            </li>
          </ul>

          <RouterLink to="/audit" class="lp-btn lp-btn--green lp-btn--large lp-btn--full">
            Audit CV Saya Sekarang
          </RouterLink>

          <p class="lpc-footnote">Lebih murah dari secangkir kopi.</p>
        </div>
      </div>
    </section>

    <!-- ══ FAQ ══════════════════════════════════════════════════════════ -->
    <section id="faq" class="lp-section">
      <div class="lp-wrap lp-faq-wrap">
        <div class="lp-section-header reveal">
          <h2 class="lp-h2">Pertanyaan yang Sering Ditanyakan</h2>
        </div>

        <div class="lp-faq">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="lp-faq-item reveal"
            :class="{ 'lp-faq-item--open': openFaq === i }"
            :style="`animation-delay:${i * 0.07}s`"
          >
            <button class="lp-faq-q" @click="toggleFaq(i)">
              {{ faq.q }}
              <span class="lp-faq-chevron" :class="{ 'lp-faq-chevron--open': openFaq === i }">›</span>
            </button>
            <div class="lp-faq-a" :class="{ 'lp-faq-a--open': openFaq === i }">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FINAL CTA ══════════════════════════════════════════════════════ -->
    <section class="lp-final-cta">
      <div class="lp-wrap lp-final-cta__inner reveal">
        <h2 class="lp-final-cta__h2">CV Anda Sudah Siap untuk Dikirim?</h2>
        <p class="lp-final-cta__sub">Biarkan Cya memberitahu Anda — sebelum rekruter melakukannya.</p>
        <RouterLink to="/audit" class="lp-btn lp-btn--large lp-btn--warm">
          Audit CV Saya — Rp10.000
        </RouterLink>
      </div>
    </section>

    <!-- ══ FOOTER ══════════════════════════════════════════════════════ -->
    <footer class="lp-footer">
      <div class="lp-wrap lp-footer__inner">
        <div>
          <span class="lp-logo">CYA</span>
          <p class="lp-footer__tagline">Audit CV. Bukan Buat CV.</p>
        </div>
        <div class="lp-footer__links">
          <RouterLink to="/audit">Mulai Audit</RouterLink>
          <a href="#faq">FAQ</a>
          <a href="#cara-kerja">Cara Kerja</a>
        </div>
        <p class="lp-footer__copy">© 2025 CYA by Legacya Sphere</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

// Nav scroll state
const navScrolled = ref(false)
const mobileOpen  = ref(false)

// FAQ state
const openFaq = ref(null)
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

// Data
const steps = [
  { icon: '📄', title: 'Upload CV',          desc: 'Upload file PDF CV Anda. Maks 5MB.' },
  { icon: '🤖', title: 'AI Menganalisis',     desc: 'Cya membaca CV seperti rekruter Indonesia.' },
  { icon: '✅', title: 'Dapat Feedback Jujur', desc: 'Laporan lengkap siap dalam kurang dari 1 menit.' },
]

const mistakes = [
  {
    icon: '📊',
    title: 'Tidak Ada Achievement',
    desc: 'CV berisi deskripsi tugas, bukan pencapaian. Rekruter ingin angka dan dampak nyata.',
  },
  {
    icon: '💬',
    title: 'Summary Terlalu Generik',
    desc: '"Saya pribadi yang dinamis" tidak membedakan Anda dari 200 pelamar lain.',
  },
  {
    icon: '🛠️',
    title: 'Skill Tidak Relevan',
    desc: 'Mencantumkan Microsoft Word di 2025 bukan nilai tambah untuk sebagian besar posisi.',
  },
  {
    icon: '🤖',
    title: 'Tidak ATS-Friendly',
    desc: 'CV berbentuk tabel atau kolom ganda sering gagal dibaca sistem ATS perusahaan.',
  },
]

const features = [
  'Audit mendalam dari perspektif rekruter Indonesia',
  'Skor kesiapan ATS dan kesiapan interview',
  'Identifikasi kekuatan dan kelemahan spesifik',
  'Action plan prioritas tinggi, sedang, dan rendah',
  'Relevan untuk semua jenjang karir',
  'Hasil dalam kurang dari 1 menit',
]

const faqs = [
  {
    q: 'Apakah data CV saya aman?',
    a: 'Ya. CV Anda hanya diproses untuk keperluan audit dan tidak disebarkan ke pihak ketiga. Data disimpan dengan enkripsi dan hanya digunakan untuk menghasilkan laporan Anda.',
  },
  {
    q: 'Berapa lama hasilnya keluar?',
    a: 'Umumnya kurang dari 1 menit setelah pembayaran dikonfirmasi. Proses AI berjalan otomatis segera setelah transaksi berhasil.',
  },
  {
    q: 'Apakah cocok untuk fresh graduate?',
    a: 'Sangat cocok. CYA dirancang untuk semua level — Fresh Graduate, Junior, Mid-Level, hingga Senior. Feedback disesuaikan dengan jenjang pengalaman yang Anda pilih.',
  },
  {
    q: 'Metode pembayaran apa yang tersedia?',
    a: 'Kami menggunakan Midtrans yang mendukung GoPay, OVO, DANA, transfer bank (BCA, BNI, BRI, Mandiri), QRIS, dan kartu kredit/debit.',
  },
  {
    q: 'Apa bedanya CYA dengan AI CV builder lainnya?',
    a: 'CYA tidak membuatkan CV — CYA mengevaluasi CV Anda dari sudut pandang rekruter Indonesia yang sesungguhnya. Feedback spesifik per posisi dan level, bukan template generik.',
  },
]

// Lifecycle
let scrollHandler
let revealObserver

onMounted(() => {
  scrollHandler = () => { navScrolled.value = window.scrollY > 8 }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 },
  )

  // Trigger hero items immediately
  document.querySelectorAll('.lp .reveal').forEach(el => revealObserver.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  revealObserver?.disconnect()
})
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────────────────────── */
.lp {
  --cream:       #F7F4EF;
  --cream-dark:  #EDE8E0;
  --dark:        #1C1A17;
  --ink:         #3D3A34;
  --muted:       #7A7368;
  --green:       #2A5C45;
  --green-light: #E8F2EC;
  --warm:        #C4996A;
  --border:      #E4DED5;

  background: var(--cream);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
}

/* ── Layout helpers ─────────────────────────────────────────────────── */
.lp-wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
.lp-section { padding: 80px 0; }
.lp-section--tinted { background: var(--cream-dark); }

/* ── Typography ─────────────────────────────────────────────────────── */
.lp-h2 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}
.lp-section-header { text-align: center; margin-bottom: 56px; }
.lp-section-sub { color: var(--muted); margin: 10px 0 0; font-size: 1rem; }

/* ── Buttons ────────────────────────────────────────────────────────── */
.lp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  background: var(--ink);
  color: #fff;
  border: none;
  cursor: pointer;
}
.lp-btn:hover { transform: scale(1.02); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }

.lp-btn--green { background: var(--green); }
.lp-btn--green:hover { background: #235039; }

.lp-btn--warm { background: var(--warm); color: #fff; }
.lp-btn--warm:hover { background: #b3875a; }

.lp-btn--large { padding: 14px 28px; font-size: 1rem; border-radius: 12px; }
.lp-btn--full  { width: 100%; }

/* ── NAV ────────────────────────────────────────────────────────────── */
.lp-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--cream);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.lp-nav--scrolled {
  box-shadow: 0 1px 12px rgba(0,0,0,0.08);
  border-bottom: 1px solid var(--border);
}
.lp-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.lp-logo {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--green);
  text-decoration: none;
  letter-spacing: -0.02em;
}
.lp-nav__links {
  display: flex;
  align-items: center;
  gap: 28px;
}
.lp-nav__links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.15s;
}
.lp-nav__links a:hover { color: var(--ink); }

.lp-nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.lp-nav__burger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--ink);
  border-radius: 2px;
}
.lp-nav__mobile {
  padding: 16px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-top: 1px solid var(--border);
}
.lp-nav__mobile a {
  color: var(--ink);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .lp-nav__links { display: none; }
  .lp-nav__burger { display: flex; }
}

/* ── HERO ───────────────────────────────────────────────────────────── */
.lp-hero {
  padding: 80px 0 100px;
}
.lp-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.lp-eyebrow {
  display: inline-block;
  background: var(--green-light);
  color: var(--green);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 20px;
}
.lp-hero__h1 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--ink);
  margin: 0 0 20px;
}
.lp-hero__sub {
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.7;
  margin: 0 0 32px;
  max-width: 460px;
}
.lp-microcopy {
  margin: 14px 0 24px;
  font-size: 0.82rem;
  color: var(--muted);
}
.lp-social-proof {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--muted);
}
.lp-social-proof strong { color: var(--ink); }
.lp-avatars {
  display: flex;
}
.lp-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: -8px;
}
.lp-avatar:first-child { margin-left: 0; }

.lp-hero__visual {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .lp-hero { padding: 48px 0 64px; }
  .lp-hero__inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .lp-hero__visual { order: -1; }
}

/* ── CARD MOCKUP ────────────────────────────────────────────────────── */
.lp-card-mockup {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(60, 58, 52, 0.16), 0 4px 16px rgba(60, 58, 52, 0.08);
  padding: 28px;
  width: 280px;
  transform: rotate(-2deg);
  animation: lp-float 4s ease-in-out infinite;
}
@keyframes lp-float {
  0%, 100% { transform: translateY(0)    rotate(-2deg); }
  50%       { transform: translateY(-14px) rotate(-2deg); }
}

.lcm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.lcm-logo {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: 1rem;
  color: var(--green);
}
.lcm-badge {
  background: var(--green-light);
  color: var(--green);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 100px;
}

.lcm-cv { margin-bottom: 18px; }
.lcm-cv__name  { height: 10px; background: #3D3A34; border-radius: 4px; width: 55%; margin-bottom: 6px; }
.lcm-cv__title { height: 7px;  background: #7A7368; border-radius: 4px; width: 38%; margin-bottom: 14px; }
.lcm-cv__divider { height: 1px; background: #EDE8E0; margin-bottom: 10px; }
.lcm-cv__line  { height: 6px;  background: #E8E4DC; border-radius: 4px; margin-bottom: 6px; }

.lcm-score {
  background: var(--green-light);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  margin-bottom: 16px;
}
.lcm-score__num   { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 2rem; font-weight: 800; color: var(--green); }
.lcm-score__denom { font-size: 0.9rem; color: var(--muted); }

.lcm-chips { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.lcm-chip  {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.lcm-chip--pass { background: #F0FBF5; color: #1E7A4A; }
.lcm-chip--fail { background: #FFF0F0; color: #C0392B; }
.lcm-chip--warn { background: #FFF8EC; color: #A0620A; }

.lcm-comment {
  border-top: 1px solid #EDE8E0;
  padding-top: 12px;
  font-size: 0.75rem;
  color: var(--muted);
  line-height: 1.5;
  font-style: italic;
}

/* ── HOW IT WORKS ────────────────────────────────────────────────────── */
.lp-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  position: relative;
}
.lp-step {
  text-align: center;
  padding: 32px 24px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 20px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-step:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(60,58,52,0.1);
}
.lp-step__icon { font-size: 2rem; margin-bottom: 10px; }
.lp-step__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--green-light);
  color: var(--green);
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 14px;
}
.lp-step__title { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; font-size: 1rem; color: var(--ink); margin: 0 0 8px; }
.lp-step__desc  { font-size: 0.875rem; color: var(--muted); margin: 0; line-height: 1.6; }

/* Dashed connector lines */
.lp-step-connector {
  position: absolute;
  top: 56px;
  width: calc(33.33% - 60px);
  height: 0;
  border-top: 2px dashed var(--border);
  pointer-events: none;
}
.lp-step-connector--1 { left: calc(33.33% + 12px); }
.lp-step-connector--2 { left: calc(66.66% + 12px); }

@media (max-width: 768px) {
  .lp-steps { grid-template-columns: 1fr; }
  .lp-step-connector { display: none; }
}

/* ── AUDIT PREVIEW ──────────────────────────────────────────────────── */
.lp-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* Abstract CV mock */
.lp-cv-mock {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid var(--border);
}
.lcv-top { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
.lcv-photo {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: var(--green-light);
  flex-shrink: 0;
}
.lcv-info { flex: 1; padding-top: 4px; }
.lcv-section-label {
  height: 8px;
  background: var(--green-light);
  border-radius: 4px;
  width: 30%;
  margin-bottom: 10px;
}
.lcv-line {
  height: 6px;
  background: #EDE8E0;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 7px;
}
.lcv-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.lcv-chip { height: 22px; width: 56px; background: #EDE8E0; border-radius: 100px; }

/* Result panel */
.lp-result-panel {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 24px rgba(60,58,52,0.07);
}
.lrp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.lrp-tag   { font-size: 0.78rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
.lrp-score { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--green); }
.lrp-impression { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin: 0 0 20px; }

.lrp-meter-label { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 8px; }
.lrp-meter-label strong { color: var(--green); }
.lrp-meter-track {
  height: 8px;
  background: var(--green-light);
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 24px;
}
.lrp-meter-fill {
  height: 100%;
  background: var(--green);
  border-radius: 100px;
}
.lrp-subhead { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; font-size: 0.875rem; color: var(--ink); margin: 0 0 10px; }
.lrp-list { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 7px; }
.lrp-list li { font-size: 0.82rem; display: flex; align-items: flex-start; gap: 8px; }
.lrp-list--pass li::before { content: '✓'; color: #1E7A4A; font-weight: 700; flex-shrink: 0; }
.lrp-list--fail li::before { content: '✗'; color: #C0392B; font-weight: 700; flex-shrink: 0; }

@media (max-width: 768px) {
  .lp-preview { grid-template-columns: 1fr; }
  .lp-preview__cv { display: none; }
}

/* ── COMMON MISTAKES ────────────────────────────────────────────────── */
.lp-mistakes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.lp-mistake-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-mistake-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(60,58,52,0.1);
}
.lmc-icon  { font-size: 1.8rem; margin-bottom: 12px; }
.lmc-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--ink);
  margin: 0 0 8px;
}
.lmc-desc { font-size: 0.875rem; color: var(--muted); margin: 0; line-height: 1.6; }

@media (max-width: 768px) {
  .lp-mistakes { grid-template-columns: 1fr; }
}

/* ── PRICING ─────────────────────────────────────────────────────────── */
.lp-pricing-card {
  max-width: 440px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(60,58,52,0.1);
}
.lpc-eyebrow {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--green);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}
.lpc-price {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 8px;
}
.lpc-currency { font-size: 1.5rem; vertical-align: top; margin-top: 12px; display: inline-block; }
.lpc-label { color: var(--muted); font-size: 0.9rem; margin: 0 0 32px; }

.lpc-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lpc-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--ink); }
.lpc-check { color: var(--green); font-weight: 700; flex-shrink: 0; }
.lpc-footnote { margin-top: 16px; font-size: 0.8rem; color: var(--muted); }

/* ── FAQ ─────────────────────────────────────────────────────────────── */
.lp-faq-wrap { max-width: 680px; }
.lp-faq { display: flex; flex-direction: column; gap: 12px; }

.lp-faq-item {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.lp-faq-item--open { box-shadow: 0 4px 20px rgba(60,58,52,0.08); }

.lp-faq-q {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 20px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.lp-faq-q:hover { color: var(--green); }

.lp-faq-chevron {
  font-size: 1.4rem;
  color: var(--muted);
  transform: rotate(0deg);
  transition: transform 0.25s ease;
  flex-shrink: 0;
  line-height: 1;
}
.lp-faq-chevron--open { transform: rotate(90deg); }

.lp-faq-a {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.lp-faq-a--open { max-height: 280px; }
.lp-faq-a p {
  padding: 0 24px 20px;
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.7;
  margin: 0;
}

/* ── FINAL CTA ───────────────────────────────────────────────────────── */
.lp-final-cta { background: var(--dark); padding: 96px 0; }
.lp-final-cta__inner { text-align: center; }
.lp-final-cta__h2 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: #F7F4EF;
  margin: 0 0 16px;
}
.lp-final-cta__sub {
  color: rgba(247, 244, 239, 0.55);
  font-size: 1rem;
  margin: 0 0 36px;
}

/* ── FOOTER ──────────────────────────────────────────────────────────── */
.lp-footer { background: var(--dark); border-top: 1px solid rgba(255,255,255,0.06); padding: 40px 0; }
.lp-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.lp-footer .lp-logo { color: #F7F4EF; font-size: 1.1rem; display: block; margin-bottom: 4px; }
.lp-footer__tagline { font-size: 0.8rem; color: rgba(247,244,239,0.4); margin: 0; }
.lp-footer__links { display: flex; gap: 24px; }
.lp-footer__links a { color: rgba(247,244,239,0.5); text-decoration: none; font-size: 0.85rem; transition: color 0.15s; }
.lp-footer__links a:hover { color: #F7F4EF; }
.lp-footer__copy { font-size: 0.78rem; color: rgba(247,244,239,0.3); margin: 0; }

@media (max-width: 768px) {
  .lp-footer__inner { flex-direction: column; align-items: flex-start; }
}

/* ── Scroll reveal ───────────────────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
