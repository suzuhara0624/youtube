let player;

const DEFAULT_VIDEO_ID = "zeGYRwOJOho";

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Called automatically by YouTube IFrame API
function onYouTubeIframeAPIReady() {
  const videoId = getQueryParam('v') || DEFAULT_VIDEO_ID;
  const timeParam = getQueryParam('t');

  player = new YT.Player('player', {
    height: '720',
    width: '1280',
    videoId: videoId,
    playerVars: {
      playsinline: 1
    },
    events: {
      onReady: () => {
        if (timeParam) {
          const seconds = parseTime(timeParam);
          if (seconds !== null) {
            player.seekTo(seconds, true);
          }
        }
      }
    }
  });
}

// HH:mm:ss → seconds
function parseTime(str) {
  const parts = str.split(':').map(Number);
  if (parts.some(isNaN)) return null;

  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return null;
}

function jumpTime() {
  const t = document.getElementById('timeInput').value.trim();
  const seconds = parseTime(t);
  if (seconds !== null && player) {
    player.seekTo(seconds, true);
  }
}

function extractVideoId(input) {
  const match = input.match(/[?&]v=([^&]+)/);
  if (match) return match[1];

  const short = input.match(/youtu\.be\/([^?]+)/);
  if (short) return short[1];

  return input;
}

function changeVideo() {
  const input = document.getElementById('urlInput').value.trim();
  if (!input || !player) return;

  const videoId = extractVideoId(input);
  player.loadVideoById(videoId);

  // update URL without reload
  history.replaceState(null, '', `?v=${videoId}`);
}
