import { useState, useRef, useEffect } from "react";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Minimize2,
} from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleSettings = () => {
    // Placeholder for settings functionality
    console.log("Settings clicked - implement your settings menu here");
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      };
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      />

      {/* Custom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 cursor-pointer group">
        <div
          className="h-full bg-red-600 transition-all duration-150 ease-out relative"
          style={{ width: `${progressPercentage}%` }}>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"></div>
        </div>
      </div>

      {/* Video Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 transition-all duration-300 ${
          isHovering || !isPlaying
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}>
        {/* Main Controls Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-14 h-14 bg-white/25 hover:bg-white/35 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg"
              aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>

            {/* Volume Control */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}>
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-12 h-12 bg-white/25 hover:bg-white/35 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg">
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Volume Slider */}
              <div
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-200 ${
                  showVolumeSlider
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}>
                <div className="bg-black/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white/20">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to top, #ff0000 0%, #ff0000 ${
                        volume * 100
                      }%, #4a5568 ${volume * 100}%, #4a5568 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Time Display */}
            <div className="flex items-center text-white text-base font-semibold bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-2 text-white/70">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Settings Button */}
            <button
              onClick={handleSettings}
              className="flex items-center justify-center w-12 h-12 bg-white/25 hover:bg-white/35 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg">
              <Settings className="w-5 h-5 text-white" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-12 h-12 bg-white/25 hover:bg-white/35 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg">
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar with Hover Preview */}
        <div className="relative w-full h-3 bg-white/20 rounded-full cursor-pointer group">
          <div
            className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progressPercentage}%` }}>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg border-2 border-white"></div>
          </div>

          {/* Clickable Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-24 h-24 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 backdrop-blur-sm border-2 border-white/30 shadow-2xl">
            <Play className="w-10 h-10 text-white ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Editorial;
