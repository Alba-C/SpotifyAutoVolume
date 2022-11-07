# SpotifyAutoVolume_

Small node app that will automatically lower volume when an ad is about to play and raise volume after its done.
I love spotify but the ads are so loud and distracting, this script allow you to lower the volume to a reasonable level and then go back to normal volume when the music starts again.

The Spotify desktop app (for Mac at least) has a cache folder that updates everytime an ad is about to play. Look for `"/Library/Caches/com.spotify.client/fsCachedData"` Assign this path to the `"watchFolder"` and run `"node app.js"` while spotify is running.

## Settings:

`const homedir = "your/home/directory"` || `require("os").homedir();`

`const watchFolder = "/Library/Caches/com.spotify.client/fsCachedData/";`// set to path where "com.spotify.client/fsCachedData" is located

`let minVolume = 1;` //set the Number where you want the volume to be set while ads are playing.

## `example.json`

The watchFolder gets a lot of files that we don't care about here. Usually the files that are over 16kb tend to have the ad info needed. The `example.json` shows what the contents of relevant file looks like.
