'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, User, Volume2, Loader2 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { AudioPlayer } from './AudioPlayer';
import type { NewsCardProps, NEWS_CATEGORY_LABELS, NEWS_CATEGORY_COLORS } from '@/types/news';
import { NEWS_CATEGORY_LABELS as categoryLabels, NEWS_CATEGORY_COLORS as categoryColors } from '@/types/news';
import type { VoiceType, AudioGenerationResponse } from '@/types/voice';
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
} from 'react-share';

export function NewsCard({
  item,
  featured = false,
  showSummary = true,
  showSource = true,
  showCategory = true,
  showShareButtons = true,
}: NewsCardProps) {
  const [showAudio, setShowAudio] = useState(false);
  const [audioData, setAudioData] = useState<AudioGenerationResponse | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [preferredVoice, setPreferredVoice] = useState<VoiceType>('female');

  const formattedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  const shareUrl = `https://cxoacademy.co/news/${item.id}`;
  const shareTitle = item.title;

  // Load voice preference
  useEffect(() => {
    const savedVoice = localStorage.getItem('audioPlayerVoiceType') as VoiceType;
    if (savedVoice) {
      setPreferredVoice(savedVoice);
    }
  }, []);

  // Fetch or generate audio
  const fetchAudio = async (voice: VoiceType = preferredVoice) => {
    setAudioLoading(true);
    setAudioError(null);

    try {
      const response = await fetch(`/api/news/${item.id}/audio?voice=${voice}`);
      const data: AudioGenerationResponse = await response.json();

      if (data.success) {
        setAudioData(data);
        setShowAudio(true);
      } else {
        setAudioError(data.error || 'Failed to load audio');
      }
    } catch (error) {
      console.error('Audio fetch error:', error);
      setAudioError('Failed to load audio. Please try again.');
    } finally {
      setAudioLoading(false);
    }
  };

  const handleAudioClick = () => {
    if (showAudio) {
      setShowAudio(false);
    } else {
      fetchAudio();
    }
  };

  const handleVoiceChange = (voice: VoiceType) => {
    setPreferredVoice(voice);
    localStorage.setItem('audioPlayerVoiceType', voice);
    fetchAudio(voice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/news/${item.id}`}>
        <Card
          hover
          className={`h-full overflow-hidden ${featured ? 'lg:flex' : ''}`}
        >
          {item.image_url && featured && (
            <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          
          <div className={`p-6 ${featured && item.image_url ? 'lg:w-2/3' : ''}`}>
            {/* Category Badge */}
            {showCategory && (
              <div className="mb-3">
                <Badge
                  variant={categoryColors[item.category] as any}
                  size="sm"
                >
                  {categoryLabels[item.category]}
                </Badge>
              </div>
            )}
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {item.title}
            </h3>
            
            {/* Summary - More Prominent Preview */}
            {showSummary && (item.summary && item.summary.length > 0) ? (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {item.summary}
              </p>
            ) : showSummary ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm italic mb-4">
                Click to read the full article...
              </p>
            ) : null}
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              {showSource && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>{item.source_name}</span>
                </div>
              )}
              
              {item.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{item.author}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
            
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Audio Button */}
            <div className="mb-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAudioClick();
                }}
                disabled={audioLoading}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showAudio
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={showAudio ? 'Hide audio player' : 'Listen to article'}
              >
                {audioLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{showAudio ? 'Hide Audio' : 'Listen'}</span>
                  </>
                )}
              </button>

              {audioError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {audioError}
                </p>
              )}
            </div>

            {/* Audio Player */}
            {showAudio && audioData && audioData.audioUrl && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="mb-4"
              >
                <AudioPlayer
                  audioId={item.id}
                  audioUrl={audioData.audioUrl}
                  title={item.title}
                  duration={audioData.duration}
                  voiceType={preferredVoice}
                  onVoiceChange={handleVoiceChange}
                  compact
                />
              </div>
            )}
            
            {/* Share Buttons */}
            {showShareButtons && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  Share:
                </span>
                <TwitterShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="hover:opacity-80 transition-opacity"
                >
                  <TwitterIcon size={24} round />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="hover:opacity-80 transition-opacity"
                >
                  <LinkedinIcon size={24} round />
                </LinkedinShareButton>
                <FacebookShareButton
                  url={shareUrl}
                  className="hover:opacity-80 transition-opacity"
                >
                  <FacebookIcon size={24} round />
                </FacebookShareButton>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
