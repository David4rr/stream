/**
 * Mock Data for Beranda (Streaming Platform)
 */

import { BerandaData } from "./types";

export const MOCK_BERANDA_DATA: BerandaData = {
  hero: {
    id: "hero-1",
    title: "Dewa Judi (Sulih Suara)",
    description:
      "Selama liburan Tahun Baru Imlek, Yena dijebak oleh sahabatnya, Ceni, dan kalah judi 400 juta. Uang itu adalah biaya sekolah putrinya, biaya pengobatan ayahnya, dan biaya hidup keluarga mereka bertiga. Demi mendapatkan kembali uang tersebut, Sandi nekat masuk ke dalam lingkaran judi itu untuk melawan mereka dengan menggunakan teknik judi tingkat tinggi.",
    category: "Romance",
    episodes: 30,
    views: "345,800 views",
  },
  categories: [
    {
      id: "romance",
      title: "Romance",
      movies: [
        { id: "r1", title: "Tunanganku Pengawalku" },
        { id: "r2", title: "Suami untuk Tiga Tahun" },
        { id: "r3", title: "Cinta di Ujung Jalan" },
        { id: "r4", title: "Kemarin dan Selamanya" },
        { id: "r5", title: "Hati yang Terluka" },
        { id: "r6", title: "Janji di Bawah Hujan" },
        { id: "r7", title: "Dewa Judi (Sulih Suara)" },
        { id: "r8", title: "Cinta Sejati" },
        { id: "r9", title: "Kisah Klasik" },
      ],
    },
    {
      id: "action",
      title: "Action",
      movies: [
        { id: "a1", title: "Pemburu Bayaran" },
        { id: "a2", title: "Duel di Kota Besar" },
        { id: "a3", title: "Misi Rahasia" },
        { id: "a4", title: "Perang Saudara" },
        { id: "a5", title: "Pahlawan Tanpa Tanda Jasa" },
        { id: "a6", title: "Kilatan Pedang" },
        { id: "a7", title: "Pertarungan Terakhir" },
        { id: "a8", title: "Agen Rahasia" },
        { id: "a9", title: "Penjaga Keamanan" },
      ],
    },
    {
      id: "thriller",
      title: "Thriller",
      movies: [
        { id: "t1", title: "Malam Menakutkan" },
        { id: "t2", title: "Rumah Hantu" },
        { id: "t3", title: "Misteri Tengah Malam" },
        { id: "t4", title: "Teror di Kampus" },
        { id: "t5", title: "Suara dari Kubur" },
        { id: "t6", title: "Bayangan Hitam" },
        { id: "t7", title: "Kutukan Keluarga" },
        { id: "t8", title: "Pembunuhan di Villa" },
        { id: "t9", title: "Rahasia Kamar 13" },
      ],
    },
  ],
  promo: {
    title: "Bayar Sekali,",
    subtitle: "Bisa Nonton Sepuasnya",
    description:
      'Kamu bisa menonton drama dengan sekali bayar. sekali bayar langsung bisa mengakses seluruh drama yang ada di website ini, jadi nuggu apa ? langsung Klik Tombol "Bebas" di bawah',
    ctaText: "Bebas",
    ctaLink: "#subscribe",
  },
  faqs: [
    {
      id: "faq1",
      question: "Apa itu CIDWatch?",
      answer:
        "CIDWatch adalah platform streaming drama Asia terlengkap dengan koleksi ribuan drama dari berbagai negara.",
    },
    {
      id: "faq2",
      question: "CIDWatch Apakah benar gratis?",
      answer:
        "CIDWatch menawarkan versi gratis dengan iklan terbatas. Untuk pengalaman tanpa iklan, Anda dapat berlangganan CIDWatch Premium.",
    },
    {
      id: "faq3",
      question: "Di mana CIDWatch tersedia?",
      answer:
        "CIDWatch tersedia di seluruh dunia. Anda dapat mengaksesnya melalui website dan aplikasi mobile.",
    },
    {
      id: "faq4",
      question: "Bagaimana cara saya menyesuaikan pengalaman CIDWatch saya?",
      answer:
        "Anda dapat membuat playlist favorit, mengatur subtitle dengan berbagai bahasa, dan mendapatkan rekomendasi personal.",
    },
    {
      id: "faq5",
      question: "Bisakah saya menggunakan CIDWatch untuk menikmati media pribadi saya sendiri?",
      answer:
        "Ya, dengan fitur CIDWatch Cloud, Anda dapat mengunggah koleksi pribadi Anda dan menontonnya di semua perangkat.",
    },
  ],
  footer: {
    sections: [
      {
        title: "Company",
        links: [
          { label: "About", href: "#" },
          { label: "Careers", href: "#" },
          { label: "Our Culture", href: "#" },
          { label: "Press Room", href: "#" },
          { label: "Advertise with Us", href: "#" },
        ],
      },
      {
        title: "Plex Pass",
        links: [
          { label: "Go Premium", href: "#" },
          { label: "Plexamp", href: "#" },
          { label: "Plex Labs", href: "#" },
          { label: "Get Perks", href: "#" },
        ],
      },
      {
        title: "Downloads",
        links: [
          { label: "Plex Media Server", href: "#" },
          { label: "Apps & Devices", href: "#" },
          { label: "Pleramp", href: "#" },
          { label: "Where to Watch", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Finding Help", href: "#" },
          { label: "Support Library", href: "#" },
          { label: "Community Forums", href: "#" },
          { label: "Billing Questions", href: "#" },
          { label: "Status", href: "#" },
        ],
      },
      {
        title: "Watch Free",
        links: [
          { label: "TV Channel Finder", href: "#" },
          { label: "What to Watch", href: "#" },
          { label: "What to Watch on Hulu", href: "#" },
          { label: "A24 Collection", href: "#" },
        ],
      },
    ],
    copyright: "All Copyright ©2024 CIDWatch",
    legalLinks: [
      { label: "Language: English (US)", href: "#" },
      { label: "Privacy & Legal", href: "#" },
      { label: "Manage Cookies", href: "#" },
    ],
  },
};
