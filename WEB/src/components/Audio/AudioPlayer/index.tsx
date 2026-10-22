import React, { useRef, useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import * as S from '../../../styles';
import { ButtonType } from '../../../types';
import { IconButton } from '@mui/material';

export interface AudioPlayerProps {
  URL: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ URL }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleTimeUpdate = () => {
    const audioElement = audioRef.current;
    if (audioElement && isFinite(audioElement.currentTime) && !isNaN(audioElement.currentTime)) {
      setCurrentTime(audioElement.currentTime);
    } else {
      setCurrentTime(0);
    }
  };

  const handleLoadedMetadata = () => {
    const audioElement = audioRef.current;
    if (audioElement && isFinite(audioElement.duration) && !isNaN(audioElement.duration)) {
      setDuration(audioElement.duration);
    } else {
      setDuration(0);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        if (audioElement) {
          audioElement.removeEventListener('timeupdate', handleTimeUpdate);
          audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, []);

  // Ensure we have valid numbers for calculations
  const safeDuration = isNaN(duration) || !isFinite(duration) ? 0 : duration;
  const safeCurrentTime = isNaN(currentTime) || !isFinite(currentTime) ? 0 : currentTime;
  
  const progressPercentage = safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0;
  const icons = isPlaying ? <PauseIcon className="text-primary" /> : <PlayArrowIcon className="text-primary" />;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <S.Container className="rounded-full w-[43px] h-[43px] ">
      <audio
        ref={audioRef}
        src={URL.trim()}
        autoPlay
        onPlay={handlePlay}
        onPause={handlePause}
      />
      <IconButton onClick={togglePlayPause}type={ButtonType.button}>
        {icons}    
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none"  stroke="#e5e7eb" strokeWidth="10"/>
        <circle cx="50" cy="50"  r={radius} fill="none" stroke={S.colors.primary} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={progressOffset} strokeLinecap="round"/>
      </svg>  
      </IconButton>
    </S.Container>
  );
};
