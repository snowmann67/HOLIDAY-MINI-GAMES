import React, { useState } from 'react';
import { Play, Pause, Music, ExternalLink, Volume2, Sparkles, Disc } from 'lucide-react';
import { sound } from '../game/audio';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: string;
  spotifyUrl: string;
  pandoraUrl: string;
  itunesUrl: string;
  description: string;
  badge: string;
}

export const PEANUTS_CHRISTMAS_CAROLS: Song[] = [
  {
    id: 'linus_and_lucy',
    title: 'Linus and Lucy',
    artist: 'Vince Guaraldi Trio',
    album: 'A Charlie Brown Christmas',
    year: '1965',
    spotifyUrl: 'https://open.spotify.com/search/Vince%20Guaraldi%20Trio%20Linus%20and%20Lucy',
    pandoraUrl: 'https://www.pandora.com/search/linus%20and%20lucy%20vince%20guaraldi',
    itunesUrl: 'https://music.apple.com/search?term=linus%20and%20lucy%20vince%20guaraldi',
    description: 'The world-famous signature piano bounce that makes Snoopy do his iconic happy dance!',
    badge: 'Iconic Theme',
  },
  {
    id: 'christmastime_is_here',
    title: 'Christmas Time Is Here (Vocal & Instrumental)',
    artist: 'Vince Guaraldi Trio & Choir',
    album: 'A Charlie Brown Christmas',
    year: '1965',
    spotifyUrl: 'https://open.spotify.com/search/Christmas%20Time%20Is%20Here%20Vince%20Guaraldi',
    pandoraUrl: 'https://www.pandora.com/search/christmas%20time%20is%20here%20vince%20guaraldi',
    itunesUrl: 'https://music.apple.com/search?term=christmas%20time%20is%20here%20vince%20guaraldi',
    description: 'A nostalgic, heartfelt holiday classic with gentle brushes, upright bass, and children choir.',
    badge: 'Holiday Anthem',
  },
  {
    id: 'o_tannenbaum',
    title: 'O Tannenbaum (Christmas Tree)',
    artist: 'Vince Guaraldi Trio',
    album: 'A Charlie Brown Christmas',
    year: '1965',
    spotifyUrl: 'https://open.spotify.com/search/O%20Tannenbaum%20Vince%20Guaraldi',
    pandoraUrl: 'https://www.pandora.com/search/O%20Tannenbaum%20Vince%20Guaraldi',
    itunesUrl: 'https://music.apple.com/search?term=O%20Tannenbaum%20Vince%20Guaraldi',
    description: 'Played as Charlie Brown and Linus carry their charming little tree through the snow.',
    badge: 'Carol Classic',
  },
  {
    id: 'skating',
    title: 'Skating',
    artist: 'Vince Guaraldi Trio',
    album: 'A Charlie Brown Christmas',
    year: '1965',
    spotifyUrl: 'https://open.spotify.com/search/Skating%20Vince%20Guaraldi%20Trio',
    pandoraUrl: 'https://www.pandora.com/search/skating%20vince%20guaraldi',
    itunesUrl: 'https://music.apple.com/search?term=skating%20vince%20guaraldi',
    description: 'Fast, shimmering arpeggios that mimic snowflakes falling gently on the frozen pond.',
    badge: 'Winter Waltz',
  },
  {
    id: 'hark_herald_angels',
    title: 'Hark! The Herald Angels Sing',
    artist: 'The Peanuts Gang & Choir',
    album: 'A Charlie Brown Christmas',
    year: '1965',
    spotifyUrl: 'https://open.spotify.com/search/Hark%20The%20Herald%20Angels%20Sing%20Charlie%20Brown',
    pandoraUrl: 'https://www.pandora.com/search/hark%20the%20herald%20angels%20charlie%20brown',
    itunesUrl: 'https://music.apple.com/search?term=hark%20the%20herald%20angels%20charlie%20brown',
    description: 'The triumphant finale where the whole gang gathers around the little tree and sings together!',
    badge: 'Finale Carol',
  },
  {
    id: 'what_child_is_this',
    title: 'What Child Is This (Greensleeves)',
    artist: 'Vince Guaraldi Trio',
    album: 'A Charlie Brown Christmas',
    year: '1965',
    spotifyUrl: 'https://open.spotify.com/search/What%20Child%20Is%20This%20Vince%20Guaraldi',
    pandoraUrl: 'https://www.pandora.com/search/what%20child%20is%20this%20vince%20guaraldi',
    itunesUrl: 'https://music.apple.com/search?term=what%20child%20is%20this%20vince%20guaraldi',
    description: 'Lyrical and deeply moving jazz arrangement of the beloved traditional holiday song.',
    badge: 'Peaceful Carol',
  },
];

interface JukeboxProps {
  onClose: () => void;
}

export const HolidayJukebox: React.FC<JukeboxProps> = ({ onClose }) => {
  const [isPlayingSynth, setIsPlayingSynth] = useState(sound.musicEnabled);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const togglePlayback = () => {
    const isNowPlaying = sound.toggleMusic();
    setIsPlayingSynth(isNowPlaying);
  };

  const activeSong = PEANUTS_CHRISTMAS_CAROLS[currentSongIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📻</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Peanuts Holiday Jukebox & Christmas Carols
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                Stream authentic Vince Guaraldi Christmas Carols on Spotify, Pandora & Apple Music!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 text-white font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Vinyl Player Showcase */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border-2 border-slate-900 mb-4 flex flex-col sm:flex-row items-center gap-4">
          {/* Animated Vinyl Disc */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg ${
                isPlayingSynth ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              <div className="w-9 h-9 rounded-full bg-red-600 border border-white flex items-center justify-center">
                <Disc className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-900">
              {activeSong.badge}
            </span>
            <h3 className="text-base font-black text-white mt-1">{activeSong.title}</h3>
            <p className="text-xs text-slate-300 font-medium">
              {activeSong.artist} · {activeSong.album} ({activeSong.year})
            </p>
            <p className="text-[11px] text-slate-400 mt-1 italic">{activeSong.description}</p>
          </div>

          {/* In-Game Synthesizer Audio Toggle */}
          <button
            onClick={togglePlayback}
            className={`px-4 py-2 rounded-xl border-2 border-white font-black text-xs flex items-center gap-2 shadow transition-transform active:scale-95 ${
              isPlayingSynth ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-white'
            }`}
          >
            {isPlayingSynth ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlayingSynth ? 'Pause Chime' : 'Play Chime'}
          </button>
        </div>

        {/* Songs List with External Platform Stream Links */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {PEANUTS_CHRISTMAS_CAROLS.map((song, idx) => (
            <div
              key={song.id}
              onClick={() => setCurrentSongIndex(idx)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                currentSongIndex === idx
                  ? 'bg-amber-100 border-slate-900 shadow-sm'
                  : 'bg-white border-slate-900/20 hover:border-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{idx === currentSongIndex ? '🎵' : '🎼'}</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{song.title}</h4>
                  <p className="text-[11px] text-slate-600">{song.artist}</p>
                </div>
              </div>

              {/* Streaming Platform Direct Launch Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-lg border border-slate-900 flex items-center gap-1 shadow-xs transition-colors"
                  title="Listen on Spotify"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <a
                  href={song.pandoraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black rounded-lg border border-slate-900 flex items-center gap-1 shadow-xs transition-colors"
                  title="Listen on Pandora"
                >
                  <span>Pandora</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <a
                  href={song.itunesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-black rounded-lg border border-slate-900 flex items-center gap-1 shadow-xs transition-colors"
                  title="Listen on Apple Music / iTunes"
                >
                  <span>Apple</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
