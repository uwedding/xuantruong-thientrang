// Lấy phần tử audio và nút điều khiển
const audio_music = document.getElementById("audio_music");
const on_speaker = $(".on_speaker");
const off_speaker = $(".off_speaker");

// Kiểm tra nếu URL chứa iframeMode
let urlWedding = window.location.href;
let checkMode = urlWedding.includes("iframeMode=true");

// Nếu không phải iframeMode thì setup music
if (!checkMode) {
  on_speaker.hide();
  off_speaker.show();

  // Cập nhật icon loa theo trạng thái nhạc
  function checkSpeaker() {
    if (!audio_music.paused) {
      off_speaker.hide();
      on_speaker.show();
    } else {
      off_speaker.show();
      on_speaker.hide();
    }
  }

  // Tự động phát nhạc khi người dùng tương tác
  function runMusicMode() {
    // Khi user chạm vào màn hình
    $(window).on("touchstart", function () {
      if ("timeMusic" in window) {
        audio_music.currentTime = timeMusic;
      }
      audio_music.play();
      checkSpeaker();
    });

    let hasPlayedOnScroll = false;
    // Khi user scroll lần đầu
    $(window).on("scroll", function () {
      if (!hasPlayedOnScroll) {
        if ("timeMusic" in window) {
          audio_music.currentTime = timeMusic;
        }
        audio_music.play();
        hasPlayedOnScroll = true;
        checkSpeaker();
      }
    });
  }

  // Lấy tham số từ URL
  const paramsMusic = new URLSearchParams(window.location.search);
  const getMusic = paramsMusic.get("music");

  // Nếu không có param "music" thì auto play
  if (!getMusic) {
    runMusicMode();
    audio_music.play();
    checkSpeaker();

    // Đảm bảo nhạc phát khi user chạm lần đầu
    let roleTouch = false;
    document.addEventListener(
      "touchstart",
      function () {
        if (!roleTouch) {
          if ("timeMusic" in window) {
            audio_music.currentTime = timeMusic;
          }
          audio_music.play();
          checkSpeaker();
          roleTouch = true;
        }
      },
      false
    );
  }

  // Khi click nút tắt loa
  let checkCurrentMusic = false;
  off_speaker.click(function () {
    if ("timeMusic" in window) {
      if (!checkCurrentMusic) {
        audio_music
          .play()
          .then(() => {
            audio_music.pause();
            audio_music.currentTime = timeMusic;
            audio_music.play();
            checkCurrentMusic = true;
          })
          .catch((err) => {
            console.error("Không thể phát nhạc:", err);
          });
      } else {
        audio_music.play();
      }
    } else {
      audio_music.play();
    }
    checkSpeaker();
  });

  // Khi click nút bật loa
  on_speaker.click(function () {
    audio_music.pause();
    checkSpeaker();
  });
} else {
  // Nếu trong iframe thì không phát nhạc
  audio_music.pause();
}
