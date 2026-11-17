/* ==========================================================================
   DATA PORTOFOLIO
   --------------------------------------------------------------------------
   ✏️  Mau menambah / mengubah isi? Edit ARRAY di bawah ini saja.

   Contoh menambah sertifikat:
       {
         title: 'Judul Sertifikat',
         year: '2026',
         desc: 'Penjelasan singkat.',
         img: 'akademik/ser6.png',
         link: 'akademik/ser6.png'
       },

   Simpan file, lalu muat ulang halaman. Tidak perlu menyentuh file lain.
   ========================================================================== */

const PORTFOLIO = {

    /* Teks yang berjalan di hero (efek mengetik) */
    roles: [
        'Software & AI Engineer',
        'Frontend Developer',
        'Financial & Forex Trader',
        'Continuous Learner'
    ],

    /* Kartu di section "About Me" */
    about: [
        {
            icon: 'bi-code-slash',
            title: 'Pengembangan Perangkat&nbsp;Lunak',
            desc: 'Berfokus pada pembuatan antarmuka yang bersih, responsif, dan fungsional. Selalu mencari pendekatan efisien dalam memecahkan masalah koding.'
        },
        {
            icon: 'bi-cpu',
            title: 'Eksplorasi AI & Sains Data',
            desc: 'Memiliki antusiasme tinggi pada penerapan algoritma kecerdasan buatan, pemrosesan data, dan integrasi modul cerdas ke dalam platform modern.'
        }
    ],

    /* Kartu di section "Sertifikat & Penghargaan" */
    certificates: [
        {
            title: 'Dai Muda',
            year: '2023',
            desc: 'Penghargaan atas kemampuan retorika, penguasaan materi keagamaan, dan penyampaian dakwah bernuansa Islami tingkat regional. Dipublikasikan pada kegiatan IMCO VII oleh SMAN 9 Malang.',
            img: 'akademik/ser1.png',
            link: 'akademik/ser1.png'
        },
        {
            title: 'Penulis Nasional',
            year: '2023',
            desc: 'Bentuk apresiasi atas dedikasi dan kontribusi aktif dalam bidang literasi nasional melalui program Gerakan Sekolah Menulis Buku Nasional (GSMB Nasional) oleh Nyalanesia.',
            img: 'akademik/ser2.png',
            link: 'akademik/ser2.png'
        },
        {
            title: 'Kompetensi Menulis',
            year: '2023',
            desc: 'Sertifikat kompetensi yang membuktikan keahlian dan kepiawaian dalam mengolah kata serta menyusun karya tulis melalui keikutsertaan dalam rangkaian pelatihan literasi nasional.',
            img: 'akademik/ser3.png',
            link: 'akademik/ser3.png'
        },
        {
            title: 'Akademi Penyair Juara',
            year: '2024',
            desc: 'Kelulusan Workshop 52 Jam Akademi Penyair Juara Nyalanesia. Menegaskan komitmen tinggi dalam mengasah bakat kepenyairan dan keterampilan seni sastra secara intensif.',
            img: 'akademik/ser4.png',
            link: 'akademik/ser4.png'
        },
        {
            title: 'Juara I Lomba Dai',
            year: '2025',
            desc: "Penghargaan Juara I Lomba Dai dalam rangka Isra' Mi'raj Nabi Muhammad SAW. Menunjukkan keahlian public speaking tinggi dalam menginspirasi generasi muda.",
            img: 'akademik/ser5.png',
            link: 'akademik/ser5.png'
        }
    ],

    /* Kartu di section "Work Assistants" */
    projects: [
        {
            title: 'Google Gemini',
            desc: 'Kapasitas Input Raksasa, terhubung langsung dengan pencarian real-time, serta multimodal canggih untuk memproses teks, gambar, dan analisis tabel data secara cepat.',
            img: 'work/1.jpg'
        },
        {
            title: 'Anthropic Claude',
            desc: 'Jagonya arsitektur UI/UX clean code (HTML/CSS/React), sangat patuh pada instruksi kompleks dan detail alur logika website modern.',
            img: 'work/2.jpg'
        },
        {
            title: 'OpenAI ChatGPT',
            desc: 'Sangat andal dalam menulis Pine Script & MQL untuk alur trading, pengujian strategi kuantitatif, serta debugging logika skrip teknis.',
            img: 'work/3.jpg'
        }
    ],

    /* Section "Unique Skill & Trading" */
    trading: {

        /* Badge kemampuan (ikon + teks) */
        badges: [
            { icon: 'bi-graph-up-arrow',        text: 'Forex Finance' },
            { icon: 'bi-diagram-3',             text: 'Market Structure' },
            { icon: 'bi-bar-chart-steps',       text: 'Candlestick Analysis' },
            { icon: 'bi-activity',              text: 'Price Action' },
            { icon: 'bi-shield-check',          text: 'Risk Management' },
            { icon: 'bi-person-badge',          text: 'Trading Psychology' },
            { icon: 'bi-box-arrow-in-down-right', text: 'Supply & Demand' },
            { icon: 'bi-layers',                text: 'Support & Resistance' },
            { icon: 'bi-droplet-half',          text: 'Liquidity' },
            { icon: 'bi-lightning-charge',      text: 'Break of Structure' },
            { icon: 'bi-arrow-repeat',          text: 'Change of Character' }
        ],

        /* Kartu gambar trading */
        cards: [
            {
                title: 'Market Analysis',
                desc: 'Pemetaan struktur & analisis teknikal harian.',
                img: 'Unik/trade1.jpeg'
            },
            {
                title: 'Risk & Portfolio',
                desc: 'Manajemen rasio risiko dan psikologi eksekusi.',
                img: 'Unik/trade2.png'
            },
            {
                title: 'Backtesting Lab',
                desc: 'Evaluasi historis data pergerakan harga.',
                img: 'Unik/trade3.jpeg'
            }
        ]
    }
};
