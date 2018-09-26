const fs = require("fs");
const system = require("system-control")();
const homedir = require("os").homedir();
const watchFolder = "/Library/Caches/com.spotify.client/fsCachedData/"; // set to path where "com.spotify.client/fsCachedData" is located
const watchPath = homedir + watchFolder;
let minVolume = 1; //set to 0 for mute
let adPlaying = false;
let duration = 10000;

console.log("Spotify AutoMute Listening to folder...", watchPath);

// Listen to the folder for any additions.
fs.watch(watchPath, (change, filename) => {
  // console.log("change", change);
  // console.log(fs.existsSync(watchPath + filename));

  // filename is any file added, changed or deleted from the folder
  // so we have to see if it still exists before attempting to read the file.
  if (
    filename &&
    fs.existsSync(watchPath + filename) &&
    filename != ".DS_Store"
  ) {
    console.log(filename + " was just added");

    let currentVolume;
    fs.readFile(watchPath + filename, "utf8", (err, data) => {
      if (err) console.log("Error reading file: ", err);

      //make sure the file contains JSON, some are image files
      if (isJsonString(data)) {
        let json = JSON.parse(data);
        // Not all files contain ads that will play, so we only need to track the ones that contain a "stream" array.
        if (json.pod.stream) {
          let totalReduce = json.pod.stream
            // some are marked dummy: true, these don't play so you can ignore the "duration_sec" for these

            .filter(({ dummy }) => !dummy)
            .reduce((a, b) => {
              if (b.video) {
                return a + b.video[0].duration_sec;
              }

              if (b.audio) {
                return a + b.audio[0].duration_sec;
              }
            }, 2);

          adPlaying
            ? (duration += totalReduce * 1000)
            : (duration = totalReduce * 1000);
          adPlaying = true;
          console.log("totalReduce = ", totalReduce, "duration = ", duration);

          system.audio.getSystemVolume().then(volume => {
            currentVolume = volume;
            system.audio.setSystemVolume(minVolume).then(() => {
              console.log("volume set to : ", minVolume);
              setTimeout(() => {
                system.audio.setSystemVolume(currentVolume).then(() => {
                  console.log("volume returned to : ", currentVolume);
                  adPlaying = false;
                });
              }, duration);
            });
          });
        }
      }
    });
  }
});

const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
