<template>
  <div class="lp">

    <!-- ══ NAV ══════════════════════════════════════════════════════════ -->
    <nav class="lp-nav" :class="{ 'lp-nav--scrolled': navScrolled }">
      <div class="lp-wrap lp-nav__inner">
        <RouterLink to="/" class="lp-logo">CYA</RouterLink>
        <div class="lp-nav__links">
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#preview-audit">Preview Audit</a>
          <a href="#faq">FAQ</a>
          <RouterLink to="/audit" class="lp-btn">Audit CV Saya</RouterLink>
        </div>
        <button class="lp-nav__burger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
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
        <div class="lp-hero__copy reveal">
          <div class="lp-eyebrow">Audit CV oleh AI Recruiter</div>
          <h1 class="lp-hero__h1">
            Ketahui Apa yang Recruiter Lihat Dalam 30 Detik Pertama.
          </h1>
          <p class="lp-hero__sub">
            Upload CV Anda dan dapatkan audit yang jujur, spesifik, dan relevan dengan posisi yang Anda lamar.
          </p>
          <RouterLink to="/audit" class="lp-btn lp-btn--large lp-btn--green">
            Audit CV Saya — Rp10.000
          </RouterLink>
          <p class="lp-microcopy">Hasil dalam &lt; 1 menit &nbsp;•&nbsp; Tanpa registrasi</p>
          <div class="lp-social-proof">
            <div class="lp-avatars">
              <div class="lp-avatar" style="background:#C4996A">Y</div>
              <div class="lp-avatar" style="background:#2A5C45">R</div>
              <div class="lp-avatar" style="background:#7A7368">D</div>
            </div>
            <span>Sudah <strong>200+</strong> pencari kerja mendapat feedback dari CYA</span>
          </div>
        </div>

        <div class="lp-hero__visual reveal">
          <div class="lp-card-mockup">
            <div class="lcm-header">
              <span class="lcm-logo">CYA</span>
              <span class="lcm-badge">Audit Report</span>
            </div>
            <div class="lcm-cv">
              <div class="lcm-cv__name"></div>
              <div class="lcm-cv__title"></div>
              <div class="lcm-cv__divider"></div>
              <div class="lcm-cv__line" style="width:85%"></div>
              <div class="lcm-cv__line" style="width:100%"></div>
              <div class="lcm-cv__line" style="width:70%"></div>
            </div>
            <div class="lcm-score">
              <span class="lcm-score__num">72</span>
              <span class="lcm-score__denom">/100</span>
            </div>
            <div class="lcm-chips">
              <div class="lcm-chip lcm-chip--pass">
                <svg class="lcm-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                Format Bersih
              </div>
              <div class="lcm-chip lcm-chip--fail">
                <svg class="lcm-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                Tidak Ada Angka
              </div>
              <div class="lcm-chip lcm-chip--warn">
                <svg class="lcm-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
                Summary Lemah
              </div>
            </div>
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
          <div v-for="(step, i) in steps" :key="i" class="lp-step reveal">
            <div class="lp-step__icon" v-html="icons[step.iconKey]"></div>
            <div class="lp-step__num">{{ i + 1 }}</div>
            <h3 class="lp-step__title">{{ step.title }}</h3>
            <p class="lp-step__desc">{{ step.desc }}</p>
          </div>
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
          <div class="lp-preview__cv reveal">
            <div class="lp-cv-mock">
              <div class="lcv-top">
                <div class="lcv-photo"></div>
                <div class="lcv-info">
                  <div class="lcv-line" style="width:70%;height:10px;background:#3D3A34;border-radius:4px"></div>
                  <div class="lcv-line" style="width:50%;height:7px;margin-top:6px;background:#7A7368;border-radius:4px"></div>
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
          <div class="lp-preview__result reveal">
            <div class="lp-result-panel">
              <div class="lrp-header">
                <span class="lrp-tag">Kesan Pertama</span>
                <span class="lrp-score">7/10</span>
              </div>
              <p class="lrp-impression">CV sudah rapi dan relevan untuk posisi yang dilamar. Namun beberapa bagian perlu diperkuat agar lebih menonjol.</p>
              <div class="lrp-meter-label">
                <span>Skor Kesiapan</span><strong>72/100</strong>
              </div>
              <div class="lrp-meter-track"><div class="lrp-meter-fill" style="width:72%"></div></div>
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
          <div v-for="(m, i) in mistakes" :key="i" class="lp-mistake-card reveal">
            <div class="lmc-icon" v-html="icons[m.iconKey]"></div>
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
          <div class="lpc-price"><span class="lpc-currency">Rp</span>10.000</div>
          <p class="lpc-label">Sekali bayar. Tanpa langganan.</p>
          <ul class="lpc-features">
            <li v-for="f in features" :key="f">
              <svg class="lpc-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              {{ f }}
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
          <!-- NOTE: no 'reveal' class here — Vue class patching would strip it on toggle -->
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="lp-faq-item"
            :class="{ 'lp-faq-item--open': openFaq === i }"
          >
            <button class="lp-faq-q" @click="toggleFaq(i)">
              <span>{{ faq.q }}</span>
              <svg class="lp-faq-chevron" :class="{ 'lp-faq-chevron--open': openFaq === i }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
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
          <span class="lp-logo lp-logo--light">CYA</span>
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

const navScrolled = ref(false)
const mobileOpen  = ref(false)
const openFaq     = ref(null)

function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

// SVG icons — used via v-html (trusted hardcoded data)
const icons = {
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>`,
  ai:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>`,
  check:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  chart:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
  chat:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"/></svg>`,
  cpu:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"/></svg>`,
}

const steps = [
  { iconKey: 'upload', title: 'Upload CV',           desc: 'Upload file PDF CV Anda. Maks 5MB.' },
  { iconKey: 'ai',     title: 'AI Menganalisis',      desc: 'Cya membaca CV seperti rekruter Indonesia.' },
  { iconKey: 'check',  title: 'Dapat Feedback Jujur', desc: 'Laporan lengkap siap dalam kurang dari 1 menit.' },
]

const mistakes = [
  { iconKey: 'chart',  title: 'Tidak Ada Achievement',    desc: 'CV berisi deskripsi tugas, bukan pencapaian. Rekruter ingin angka dan dampak nyata.' },
  { iconKey: 'chat',   title: 'Summary Terlalu Generik',  desc: '"Saya pribadi yang dinamis" tidak membedakan Anda dari 200 pelamar lain.' },
  { iconKey: 'wrench', title: 'Skill Tidak Relevan',      desc: 'Mencantumkan Microsoft Word di 2025 bukan nilai tambah untuk sebagian besar posisi.' },
  { iconKey: 'cpu',    title: 'Tidak ATS-Friendly',       desc: 'CV berbentuk tabel atau kolom ganda sering gagal dibaca sistem ATS perusahaan.' },
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
  { q: 'Apakah data CV saya aman?',                        a: 'Ya. CV Anda hanya diproses untuk keperluan audit dan tidak disebarkan ke pihak ketiga. Data disimpan dengan enkripsi dan hanya digunakan untuk menghasilkan laporan Anda.' },
  { q: 'Berapa lama hasilnya keluar?',                      a: 'Umumnya kurang dari 1 menit setelah pembayaran dikonfirmasi. Proses AI berjalan otomatis segera setelah transaksi berhasil.' },
  { q: 'Apakah cocok untuk fresh graduate?',               a: 'Sangat cocok. CYA dirancang untuk semua level — Fresh Graduate, Junior, Mid-Level, hingga Senior. Feedback disesuaikan dengan jenjang pengalaman yang Anda pilih.' },
  { q: 'Metode pembayaran apa yang tersedia?',             a: 'Kami menggunakan Midtrans yang mendukung GoPay, OVO, DANA, transfer bank (BCA, BNI, BRI, Mandiri), QRIS, dan kartu kredit/debit.' },
  { q: 'Apa bedanya CYA dengan AI CV builder lainnya?',   a: 'CYA tidak membuatkan CV — CYA mengevaluasi CV Anda dari sudut pandang rekruter Indonesia yang sesungguhnya. Feedback spesifik per posisi dan level, bukan template generik.' },
]

let scrollHandler
let revealObserver

onMounted(() => {
  scrollHandler = () => { navScrolled.value = window.scrollY > 8 }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  // Use inline styles, not class — prevents Vue class patching from stripping reveal state
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
        revealObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

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
  overflow-x: hidden; /* prevent horizontal scroll from rotated card */
}

/* ── Layout ─────────────────────────────────────────────────────────── */
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
  white-space: nowrap;
}
.lp-btn:hover { transform: scale(1.02); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.lp-btn--green { background: var(--green); }
.lp-btn--green:hover { background: #235039; }
.lp-btn--warm  { background: var(--warm); }
.lp-btn--warm:hover { background: #b3875a; }
.lp-btn--large { padding: 14px 28px; font-size: 1rem; border-radius: 12px; }
.lp-btn--full  { width: 100%; }

/* ── NAV ────────────────────────────────────────────────────────────── */
.lp-nav {
  position: sticky; top: 0; z-index: 50;
  background: var(--cream);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.lp-nav--scrolled {
  box-shadow: 0 1px 12px rgba(0,0,0,0.08);
  border-bottom: 1px solid var(--border);
}
.lp-nav__inner {
  display: flex; align-items: center; justify-content: space-between; height: 64px;
}
.lp-logo {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 1.3rem; font-weight: 800; color: var(--green);
  text-decoration: none; letter-spacing: -0.02em;
}
.lp-logo--light { color: #F7F4EF; display: block; margin-bottom: 4px; }
.lp-nav__links { display: flex; align-items: center; gap: 28px; }
.lp-nav__links a {
  color: var(--muted); text-decoration: none; font-size: 0.9rem;
  font-weight: 500; transition: color 0.15s;
}
.lp-nav__links a:hover { color: var(--ink); }
.lp-nav__burger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.lp-nav__burger span { display: block; width: 22px; height: 2px; background: var(--ink); border-radius: 2px; }
.lp-nav__mobile {
  padding: 16px 24px 20px; display: flex; flex-direction: column;
  gap: 16px; border-top: 1px solid var(--border);
}
.lp-nav__mobile a { color: var(--ink); text-decoration: none; font-size: 1rem; font-weight: 500; }
@media (max-width: 768px) {
  .lp-nav__links { display: none; }
  .lp-nav__burger { display: flex; }
}

/* ── HERO ───────────────────────────────────────────────────────────── */
.lp-hero { padding: 80px 0 100px; }
.lp-hero__inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}
.lp-eyebrow {
  display: inline-block; background: var(--green-light); color: var(--green);
  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.05em;
  text-transform: uppercase; padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
}
.lp-hero__h1 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 800; line-height: 1.2;
  color: var(--ink); margin: 0 0 20px;
}
.lp-hero__sub {
  font-size: 1.05rem; color: var(--muted); line-height: 1.7;
  margin: 0 0 32px; max-width: 460px;
}
.lp-microcopy { margin: 14px 0 24px; font-size: 0.82rem; color: var(--muted); }
.lp-social-proof { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--muted); }
.lp-social-proof strong { color: var(--ink); }
.lp-avatars { display: flex; }
.lp-avatar {
  width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--cream);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 0.75rem; font-weight: 700; margin-left: -8px;
}
.lp-avatar:first-child { margin-left: 0; }
.lp-hero__visual { display: flex; justify-content: center; align-items: center; }

@media (max-width: 768px) {
  .lp-hero { padding: 48px 0 64px; }
  .lp-hero__inner { grid-template-columns: 1fr; gap: 40px; }
  .lp-hero__visual { order: -1; }
}

/* ── CARD MOCKUP ────────────────────────────────────────────────────── */
.lp-card-mockup {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(60,58,52,0.16), 0 4px 16px rgba(60,58,52,0.08);
  padding: 28px;
  width: 270px;
  transform: rotate(-2deg);
  animation: lp-float 4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes lp-float {
  0%, 100% { transform: translateY(0)     rotate(-2deg); }
  50%       { transform: translateY(-14px) rotate(-2deg); }
}
@media (max-width: 768px) {
  .lp-card-mockup { width: 240px; }
}

.lcm-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.lcm-logo { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 1rem; color: var(--green); }
.lcm-badge { background: var(--green-light); color: var(--green); font-size: 0.7rem; font-weight: 600; padding: 3px 9px; border-radius: 100px; }
.lcm-cv { margin-bottom: 18px; }
.lcm-cv__name  { height: 10px; background: #3D3A34; border-radius: 4px; width: 55%; margin-bottom: 6px; }
.lcm-cv__title { height: 7px;  background: #7A7368; border-radius: 4px; width: 38%; margin-bottom: 14px; }
.lcm-cv__divider { height: 1px; background: #EDE8E0; margin-bottom: 10px; }
.lcm-cv__line  { height: 6px;  background: #E8E4DC; border-radius: 4px; margin-bottom: 6px; }
.lcm-score {
  background: var(--green-light); border-radius: 12px; padding: 12px;
  text-align: center; margin-bottom: 16px;
}
.lcm-score__num   { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 2rem; font-weight: 800; color: var(--green); }
.lcm-score__denom { font-size: 0.9rem; color: var(--muted); }
.lcm-chips { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.lcm-chip {
  font-size: 0.74rem; font-weight: 500; padding: 5px 10px; border-radius: 8px;
  display: flex; align-items: center; gap: 6px;
}
.lcm-chip-icon { width: 13px; height: 13px; flex-shrink: 0; }
.lcm-chip--pass { background: #F0FBF5; color: #1E7A4A; }
.lcm-chip--fail { background: #FFF0F0; color: #C0392B; }
.lcm-chip--warn { background: #FFF8EC; color: #A0620A; }
.lcm-comment {
  border-top: 1px solid #EDE8E0; padding-top: 12px;
  font-size: 0.74rem; color: var(--muted); line-height: 1.5; font-style: italic;
}

/* ── HOW IT WORKS ─────────────────────────────────────────────────── */
.lp-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 40px; position: relative; }
.lp-step {
  text-align: center; padding: 32px 24px;
  background: #fff; border: 1px solid var(--border); border-radius: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-step:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(60,58,52,0.1); }
.lp-step__icon {
  width: 48px; height: 48px; margin: 0 auto 10px;
  color: var(--green); display: flex; align-items: center; justify-content: center;
}
.lp-step__icon :deep(svg) { width: 100%; height: 100%; }
.lp-step__num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--green-light); color: var(--green); font-size: 0.78rem;
  font-weight: 700; margin-bottom: 12px;
}
.lp-step__title { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; font-size: 1rem; color: var(--ink); margin: 0 0 8px; }
.lp-step__desc  { font-size: 0.875rem; color: var(--muted); margin: 0; line-height: 1.6; }
.lp-step-connector {
  position: absolute; top: 52px;
  width: calc(33.33% - 52px); height: 0;
  border-top: 2px dashed var(--border); pointer-events: none;
}
.lp-step-connector--1 { left: calc(33.33% + 14px); }
.lp-step-connector--2 { left: calc(66.66% + 14px); }
@media (max-width: 768px) {
  .lp-steps { grid-template-columns: 1fr; }
  .lp-step-connector { display: none; }
}

/* ── AUDIT PREVIEW ──────────────────────────────────────────────────── */
.lp-preview { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
.lp-cv-mock { background: #fff; border-radius: 16px; padding: 28px; border: 1px solid var(--border); }
.lcv-top { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
.lcv-photo { width: 52px; height: 52px; border-radius: 10px; background: var(--green-light); flex-shrink: 0; }
.lcv-info { flex: 1; padding-top: 4px; }
.lcv-section-label { height: 8px; background: var(--green-light); border-radius: 4px; width: 30%; margin-bottom: 10px; }
.lcv-line  { height: 6px; background: #EDE8E0; border-radius: 4px; width: 100%; margin-bottom: 7px; }
.lcv-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.lcv-chip  { height: 22px; width: 56px; background: #EDE8E0; border-radius: 100px; }
.lp-result-panel {
  background: #fff; border-radius: 20px; padding: 32px;
  border: 1px solid var(--border); box-shadow: 0 4px 24px rgba(60,58,52,0.07);
}
.lrp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.lrp-tag   { font-size: 0.78rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
.lrp-score { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--green); }
.lrp-impression { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin: 0 0 20px; }
.lrp-meter-label { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 8px; }
.lrp-meter-label strong { color: var(--green); }
.lrp-meter-track { height: 8px; background: var(--green-light); border-radius: 100px; overflow: hidden; margin-bottom: 24px; }
.lrp-meter-fill  { height: 100%; background: var(--green); border-radius: 100px; }
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
.lp-mistakes { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; }
.lp-mistake-card {
  background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-mistake-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(60,58,52,0.1); }
.lmc-icon { width: 40px; height: 40px; color: var(--green); margin-bottom: 14px; }
.lmc-icon :deep(svg) { width: 100%; height: 100%; }
.lmc-title { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; font-size: 1rem; color: var(--ink); margin: 0 0 8px; }
.lmc-desc  { font-size: 0.875rem; color: var(--muted); margin: 0; line-height: 1.6; }
@media (max-width: 768px) {
  .lp-mistakes { grid-template-columns: 1fr; }
}

/* ── PRICING ─────────────────────────────────────────────────────────── */
.lp-pricing-card {
  max-width: 440px; margin: 0 auto; background: #fff; border: 1px solid var(--border);
  border-radius: 24px; padding: 48px 40px; text-align: center;
  box-shadow: 0 8px 40px rgba(60,58,52,0.1);
}
.lpc-eyebrow { font-size: 0.78rem; font-weight: 600; color: var(--green); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
.lpc-price { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 3.5rem; font-weight: 800; color: var(--ink); line-height: 1; margin-bottom: 8px; }
.lpc-currency { font-size: 1.5rem; vertical-align: top; margin-top: 12px; display: inline-block; }
.lpc-label { color: var(--muted); font-size: 0.9rem; margin: 0 0 32px; }
.lpc-features { list-style: none; padding: 0; margin: 0 0 32px; text-align: left; display: flex; flex-direction: column; gap: 12px; }
.lpc-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--ink); }
.lpc-check { width: 18px; height: 18px; color: var(--green); flex-shrink: 0; margin-top: 1px; }
.lpc-footnote { margin-top: 16px; font-size: 0.8rem; color: var(--muted); }
@media (max-width: 480px) {
  .lp-pricing-card { padding: 36px 24px; }
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */
.lp-faq-wrap { max-width: 680px; }
.lp-faq { display: flex; flex-direction: column; gap: 12px; }
.lp-faq-item {
  background: #fff; border: 1px solid var(--border); border-radius: 14px;
  overflow: hidden; transition: box-shadow 0.2s;
}
.lp-faq-item--open { box-shadow: 0 4px 20px rgba(60,58,52,0.08); }
.lp-faq-q {
  width: 100%; text-align: left; background: none; border: none;
  padding: 20px 24px; font-size: 0.95rem; font-weight: 600; color: var(--ink);
  cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.lp-faq-q:hover { color: var(--green); }
.lp-faq-chevron {
  width: 18px; height: 18px; flex-shrink: 0; color: var(--muted);
  transition: transform 0.25s ease;
}
.lp-faq-chevron--open { transform: rotate(90deg); }
.lp-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.lp-faq-a--open { max-height: 300px; }
.lp-faq-a p { padding: 0 24px 20px; font-size: 0.875rem; color: var(--muted); line-height: 1.7; margin: 0; }

/* ── FINAL CTA ───────────────────────────────────────────────────────── */
.lp-final-cta { background: var(--dark); padding: 96px 0; }
.lp-final-cta__inner { text-align: center; }
.lp-final-cta__h2 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 800; color: #F7F4EF; margin: 0 0 16px;
}
.lp-final-cta__sub { color: rgba(247,244,239,0.55); font-size: 1rem; margin: 0 0 36px; }

/* ── FOOTER ──────────────────────────────────────────────────────────── */
.lp-footer { background: var(--dark); border-top: 1px solid rgba(255,255,255,0.06); padding: 40px 0; }
.lp-footer__inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.lp-footer__tagline { font-size: 0.8rem; color: rgba(247,244,239,0.4); margin: 0; }
.lp-footer__links { display: flex; gap: 24px; }
.lp-footer__links a { color: rgba(247,244,239,0.5); text-decoration: none; font-size: 0.85rem; transition: color 0.15s; }
.lp-footer__links a:hover { color: #F7F4EF; }
.lp-footer__copy { font-size: 0.78rem; color: rgba(247,244,239,0.3); margin: 0; }
@media (max-width: 768px) {
  .lp-footer__inner { flex-direction: column; align-items: flex-start; }
}

/* ── Scroll reveal — inline styles set by IntersectionObserver ────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
</style>
