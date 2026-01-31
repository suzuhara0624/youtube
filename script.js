let player;

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}


// Called automatically by YouTube API
function onYouTubeIframeAPIReady() {
  const videoId = getQueryParam('v') || 'nQ3Ohw4Oc-4';
  const timeParam = getQueryParam('t');

  player = new YT.Player('player', {
    height: '450',
    width: '800',
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

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }
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
  // Full URL
  const match = input.match(/[?&]v=([^&]+)/);
  if (match) return match[1];

  // youtu.be short link
  const short = input.match(/youtu\.be\/([^?]+)/);
  if (short) return short[1];

  // Raw ID
  return input;
}

function changeVideo() {
  const input = document.getElementById('urlInput').value.trim();
  if (!input || !player) return;

  const videoId = extractVideoId(input);

  player.loadVideoById(videoId);

  // ✅ update URL in address bar (no reload)
  history.replaceState(null, '', `?v=${videoId}`);
}


