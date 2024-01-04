var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const crypash = require('crypash');
const { exec } = require('child_process');
const { stderr } = require('process');
const cron = require('cron');


async function getVideoBuffer(url) {
  try {
    console.log(url);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Define a function to clear the directory
const clearDirectory = (directoryPath) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        } else {
          console.log('Deleted file:', filePath);
        }
      });
    });
  });
};

/* GET home page. */
router.post('/qualities', async function (req, res, next) {
  try {
    if (ytdl.validateURL(req.body.url)) {
      let videoInfo = await ytdl.getInfo(req.body.url);
      let qualities = [];

      videoInfo.formats.forEach(format => {
        if (format.container.startsWith('mp4')) {
          qualities.push(format.qualityLabel);
        }
      });

      // Remove duplicate values and format into objects
      const uniqueQualities = Array.from(new Set(qualities));

      let formattedQualities = uniqueQualities.map(quality => {
        // Assuming the format of qualityLabel is "{resolution}p"
        const resolution = parseInt(quality);

        return {
          name: quality,
          value: resolution
        };
      });

      formattedQualities = formattedQualities.filter(obj => obj.name !== null && !isNaN(obj.value));

      res.json(formattedQualities);
    } else {
      res.status(404).json({ error: 'You entered url is not valid please try again' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/api/youtube/download', async (req, res, next) => {
  if (ytdl.validateURL(req.body.url)) {
    console.log(req.body);
    let videoInfo = await ytdl.getInfo(req.body.url);
    let video = await ytdl(req.body.url, { format: 'mp3', filter: 'audioandvideo', quality: 'highest' });

    if (req.body.type === 'mp3') {
      res.header({ "Content-Disposition": "attachment;filename=" + videoInfo.videoDetails.title + " | " + new Date() + " | Thintry - www.thintry.com .mp3" });
      ffmpeg(video).toFormat("mp3").on("error", (err) => console.log(err)).pipe(res);
    } else {
      let urls = [];

      for (const format of videoInfo.formats) {
        if (format.container.startsWith('mp4') && format.qualityLabel == req.body.quality + 'p') {
          // console.log(format);

          urls.push(format.url);

          try {
            const videoBuffer = await getVideoBuffer(urls[0]);
            const randomUniqueNumber = await crypash.hash('sha256', Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join(''));

            fs.writeFileSync(path.join('./videos', `${randomUniqueNumber}.mp4`), videoBuffer);

            await new Promise((resolve, reject) => {
              ffmpeg(video)
                .toFormat("mp3")
                .on("error", (err) => console.log(err))
                .pipe(fs.createWriteStream('./audios/' + `${randomUniqueNumber}.mp3`))
                .on('finish', () => {
                  mergeAud('./videos/' + `${randomUniqueNumber}.mp4`, './audios/' + `${randomUniqueNumber}.mp3`, videoInfo, randomUniqueNumber);
                });
            });
          } catch (err) {
            console.log(err);
            console.error('Failed to obtain video buffer:', err.message);
          }
        }
      }

      async function mergeAud(video, audio, videoInfo, randomUniqueNumber) {
        // Set the Content-Disposition header for file download
        // res.header({ "Content-Disposition": `attachment; filename="${videoInfo.videoDetails.title} | ${new Date()} | Thintry - www.thintry.com.mp4"` });
        console.log(path.join(audio));

        exec(`ffmpeg -i ${video} -i ${audio} -c copy -map 0:v:0 -map 1:a:0 ./temp/out-${randomUniqueNumber}.mp4`, (err, stderr, setdout) => {
          if (err) {
            console.log(err);
          } else {
            res.download(`./temp/out-${randomUniqueNumber}.mp4`);
          }
        });
      }

    }
  } else {
    res.status(404).json({ error: 'You entered the URL is not valid, please try again' });
  }
});


// Create a cron job to run the clearDirectory function every 2 hours
const job = new cron.CronJob('0 0 */2 * * *', () => {
  console.log('Clearing directory...');
  clearDirectory('./temp');
  clearDirectory('./videos');
  clearDirectory('./audios');
});

// Start the cron job
job.start();




module.exports = router;
