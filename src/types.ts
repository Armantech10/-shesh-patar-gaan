export interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  youtubeId?: string;
  playlistIndex?: number;
  album?: string;
  year?: string;
  lyrics?: string[];
  coverUrl?: string;
  isPendingConnection?: boolean;
}

export interface NostalgicQuote {
  id: number;
  bengali: string;
  translation: string;
  source: string;
  mood: string;
}

export interface NostalgicMemory {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  story: string;
  quote: string;
  category: 'diary' | 'cassette' | 'rain' | 'tea' | 'letters';
  tags: string[];
}

export interface ScribbleNote {
  id: string;
  text: string;
  author: string;
  date: string;
  inkColor: 'blue' | 'sepia' | 'emerald' | 'black';
  songDedication?: string;
  likes: number;
  rotation?: number;
}

export interface AmbientAudioState {
  isPlaying: boolean;
  rainVolume: number;
  tapeHissVolume: number;
  cricketsVolume: number;
}

export type CassetteSide = 'A' | 'B';
