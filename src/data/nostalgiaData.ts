import { Track, NostalgicQuote, NostalgicMemory, ScribbleNote } from '../types';

export const YOUTUBE_PLAYLIST_ID = 'PLyvTjZP_txBc6kL86-2-hKL4Agx2E1SHl';
export const DEFAULT_VIDEO_ID = '_plZHJpjfZM';

export interface MoodCategory {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  playlistId?: string; // Structured so each mood can later receive its own real YouTube playlist ID
}

export const MOOD_CATEGORIES: MoodCategory[] = [
  { id: 'rain', label: 'বৃষ্টিভেজা দুপুর', icon: '🌧️', subtitle: 'শ্রাবণের মেঘ ও ঝুম বৃষ্টি' },
  { id: 'cassette', label: 'ওয়াকম্যান ও ক্যাসেট', icon: '📼', subtitle: 'টিডিকে ৯০ মিনিটের ক্যাসেট' },
  { id: 'adda', label: 'উত্তর কলকাতার আড্ডা', icon: '☕', subtitle: 'টংয়ের চা ও পুরনো গিটার' },
  { id: 'diary', label: 'ডায়েরির শেষ পাতা', icon: '📖', subtitle: 'ব্যাকবেঞ্চের কাটাকাটি চিহ্ন' },
  { id: 'night', label: 'শেষ রাতের গান', icon: '🌙', subtitle: 'নিঝুম রাতের নির্জন সুর' },
];

export const NOSTALGIC_TRACKS: Track[] = [
  {
    id: 'yt-playlist-pending',
    title: 'ইউটিউব প্লেলিস্ট (YouTube Playlist)',
    artist: 'অফিসিয়াল প্লেলিস্ট শীঘ্রই সংযুক্ত হবে',
    duration: '--:--',
    youtubeId: '',
    playlistIndex: 0,
    isPendingConnection: true,
  }
];

export const NOSTALGIC_QUOTES: NostalgicQuote[] = [
  {
    id: 1,
    bengali: 'কিছু গান শেষ হয় না। শুধু মানুষটা বদলে যায়।',
    translation: 'Some songs never end. Only the person changes.',
    source: 'শেষ পাতার ডায়রি • ১৯৯৮',
    mood: 'চিরন্তন'
  },
  {
    id: 2,
    bengali: 'খাতার শেষ পাতায় যে গানটা লেখা ছিল, সুরটা আজও তোমায় খোঁজে...',
    translation: 'The song scribbled on the last page of the notebook is still searching for you in its melody...',
    source: 'টিফিন পিরিয়ডের গান',
    mood: 'নস্টালজিয়া'
  },
  {
    id: 3,
    bengali: 'পেন্সিল দিয়ে ক্যাসেট ঘোরানোর দিনগুলো ফুরিয়েছে, কিন্তু ফেলে আসা সেই বৃষ্টি আর গানগুলো নয়।',
    translation: 'The days of rewinding cassette spools with a Nataraj pencil may be gone, but those rain-soaked melodies remain forever.',
    source: 'ওয়াকম্যান ও ক্যাসেটের দিনগুলি',
    mood: 'স্মৃতি'
  },
  {
    id: 4,
    bengali: 'তুমি অন্য কারোর ছাতা হয়েছো কবে, আমার শহর আজও পুরোনো সেই বৃষ্টিতেই ভেজে।',
    translation: 'You became someone else’s umbrella long ago, while my city still gets drenched in the exact same old rain.',
    source: 'শ্রাবণের মেঘদল',
    mood: 'বিরহ'
  },
  {
    id: 5,
    bengali: 'টংয়ের চায়ের ধোঁয়া আর একটা ভাঙা একুস্টিক গিটার — আমরা একসময় পুরো বিশ্ব জিতে নিতে পারতাম।',
    translation: 'Steaming cups of roadside tea and a beat-up acoustic guitar — once, we could conquer the entire universe.',
    source: 'বিশ্ববিদ্যালয়ের শেষ বেঞ্চ',
    mood: 'বন্ধুত্ব'
  },
  {
    id: 6,
    bengali: 'রেডিওতে পছন্দের গানটা রেকর্ড করতে গিয়ে বিজ্ঞাপনের শব্দ ঢুকে যাওয়ার সেই আফসোসটা আজও মিস করি।',
    translation: 'Missing the innocent frustration of accidentally recording a radio commercial right at the climax of our favorite song.',
    source: 'অনুরোধের আসর • এফএম যুগ',
    mood: 'মুগ্ধতা'
  }
];

export const NOSTALGIC_MEMORIES: NostalgicMemory[] = [
  {
    id: 'mem-1',
    title: 'খাতার শেষ পাতা ও গোপন গানের কথা',
    subtitle: 'ক্লাসের ব্যাকবেঞ্চের অবিচ্ছেদ্য দলিল',
    date: 'জুলাই, ২০০৩',
    category: 'diary',
    tags: ['শেষ বেঞ্চ', 'হাতে লেখা লিরিক্স', 'টিফিন বিরতি'],
    quote: 'টিচার ব্ল্যাকবোর্ডে অঙ্ক করাচ্ছেন, আর আমরা খাতার শেষ পাতায় প্রিয় গানের সুর তুলে রাখছি।',
    story: 'প্রতিটা ক্লাসের খাতার উল্টো পিঠ ছিল আমাদের আসল মনের খাতা। সেখানে অঙ্কের হিসাব নয়, ছিল গিটারের কর্ড চার্ট, বন্ধুদের নামের কাটাকাটি, আর বৃষ্টিতে ভিজে যাওয়া গানের কলি।'
  },
  {
    id: 'mem-2',
    title: 'নটরাজ পেন্সিল ও পেঁচিয়ে যাওয়া ক্যাসেটের ফিতা',
    subtitle: 'ব্যাটারি বাঁচানোর চিরন্তন প্রযুক্তি',
    date: 'সেপ্টেম্বর, ১৯৯৯',
    category: 'cassette',
    tags: ['Sony Walkman', 'TDK D-90', 'Auto Reverse'],
    quote: 'ওয়াকম্যানের ব্যাটারি শেষ হয়ে যাবে ভয়ে পেন্সিলের শিষ ঢুকিয়ে ঘণ্টার পর ঘণ্টা ক্যাসেট রিওয়াইন্ড করা...',
    story: 'টেপ রেকর্ডারে ফিতা আটকে গেলে সাবধানে বের করে হাত দিয়ে মসৃণ করা, আর সাইড-এ শেষ হলে সাইড-বি উল্টে দেওয়া — তখনকার প্রতিটি গানের কদর ছিল অসীম।'
  },
  {
    id: 'mem-3',
    title: 'টংয়ের চা ও বৃষ্টিভেজা সন্ধ্যার আড্ডা',
    subtitle: 'এক কাপ চা, দুজন মানুষ আর হাজারটা অপ্রকাশিত গল্প',
    date: 'শ্রাবণ, ২০০৭',
    category: 'tea',
    tags: ['কাটিং চা', 'টিনের চালের বৃষ্টি', 'অনুরোধের গান'],
    quote: 'বৃষ্টির দিনে টিনের চালে ঝমঝম আওয়াজ, পাশে মাটির ভাঁড়ে লেবু চা আর রেডিওতে ভেসে আসা পুরোনো গান...',
    story: 'সন্ধ্যা নামলেই গলির মোড়ের চায়ের দোকানে জমে উঠতো গান আর রাজনীতির তর্ক। পকেটে মাত্র দশ টাকা থাকলেও মনের মধ্যে ছিল গোটা আকাশের স্বাধীনতা।'
  },
  {
    id: 'mem-4',
    title: 'ইনল্যান্ড লেটার ও শুকনো অপরাজিতা',
    subtitle: 'ডাকপিয়নের সাইকেলের ঘণ্টার অপেক্ষা',
    date: 'ডিসেম্বর, ২০০১',
    category: 'letters',
    tags: ['নীল খাম', 'ফাউন্টেন পেন', 'শুকনো ফুল'],
    quote: 'চিঠির ভেতরে গুঁজে দেওয়া ডায়েরির পাতা থেকে তুলে রাখা একটা শুকনো পাপড়ি...',
    story: 'তখন হোয়াটসঅ্যাপ ছিল না। একটা চিঠির উত্তরের জন্য ১৫ দিন জানালার ধারে বসে অপেক্ষা করার যে আকুলতা, সেই ধৈর্যের ভেতরেই লুকিয়ে ছিল আসল ভালোবাসা।'
  }
];

export const INITIAL_SCRIBBLES: ScribbleNote[] = [
  {
    id: 'sc-1',
    text: '“তোর কি মনে আছে সেই প্রথম রিকশায় ভেজার গানটা? আজও বৃষ্টি নামলে চোখ বুজি...”',
    author: 'অচেনা পথচারী',
    date: '১০ মিনিট আগে',
    inkColor: 'blue',
    songDedication: 'স্মৃতির সুর',
    likes: 42,
    rotation: -2
  },
  {
    id: 'sc-2',
    text: '“খাতার শেষ পাতায় লেখা তোর নামটা আজ আর নেই, কিন্তু কাটাকাটির দাগটা রয়ে গেছে।”',
    author: '২০০৮ ব্যাচের ব্যাকবেঞ্চার',
    date: 'আজ দুপুর',
    inkColor: 'sepia',
    songDedication: 'অপ্রকাশিত কথা',
    likes: 38,
    rotation: 1.5
  },
  {
    id: 'sc-3',
    text: '“কিছু স্মৃতি মিউজিয়ামে নয়, একটা পুরোনো টিডিকে ক্যাসেটের ভেতরেই ভালো থাকে।”',
    author: 'ওয়াকম্যান প্রেমী',
    date: 'গতকাল রাত',
    inkColor: 'black',
    songDedication: 'ক্যাসেটের গান',
    likes: 29,
    rotation: -1
  },
  {
    id: 'sc-4',
    text: '“গানটা আজও বাজে, ক্যাসেটও ঠিক আছে... শুধু আমরা আর আগের মতো একসাথে শুনতে বসিনা।”',
    author: 'একলা শ্রাবণ',
    date: '২ দিন আগে',
    inkColor: 'emerald',
    songDedication: 'বৃষ্টিভেজা দুপুর',
    likes: 56,
    rotation: 2
  }
];

export const ACOUSTIC_CHORDS = [
  { key: 'A', name: 'সা (C)', note: 'C4', freq: 261.63, chordName: 'C Maj' },
  { key: 'S', name: 'রে (D)', note: 'D4', freq: 293.66, chordName: 'Dm' },
  { key: 'D', name: 'গা (E)', note: 'E4', freq: 329.63, chordName: 'Em' },
  { key: 'F', name: 'মা (F)', note: 'F4', freq: 349.23, chordName: 'F Maj' },
  { key: 'G', name: 'পা (G)', note: 'G4', freq: 392.00, chordName: 'G Maj' },
  { key: 'H', name: 'ধা (A)', note: 'A4', freq: 440.00, chordName: 'Am' },
  { key: 'J', name: 'নি (B)', note: 'B4', freq: 493.88, chordName: 'Bdim' },
  { key: 'K', name: 'তার সা (C5)', note: 'C5', freq: 523.25, chordName: 'C high' },
];
