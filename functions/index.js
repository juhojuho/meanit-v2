const functions = require('firebase-functions');
const admin = require('firebase-admin');
const gcs = require('@google-cloud/storage')();
const axios = require('axios');
const cors = require('cors')({ origin: true });
const urlencode = require('urlencode');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');
const download = require('download-file')
const request = require('request');


const giphyAPIKey = '352JwQQruAvpZN2eqMeCzGkx0mlM8vu8';

admin.initializeApp(functions.config().firebase);

const bucket = gcs.bucket('meanit-91a3c.appspot.com');

function generateTimeKey() {
  const currDate = new Date();
  const year = currDate.getFullYear();
  let month = currDate.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let date = currDate.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  return `${year}a${month}a${date}`;
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addDefaultUserData = functions.auth.user().onCreate(event => {
  const user = event.data;
  const date = new Date();
  const update = {};
  update[`/users/${user.uid}/`] = {
    num_it: 0,
    num_like: 0,
    nickname: user.displayName,
    its: {},
    addNickname: false,
    birth: {
      year: 2017,
      month: 1,
    },
    img_url: `gs://meanit-91a3c.appspot.com/profile/${user.uid}`,
    signup_date: date,
    email: '',
    my_kk: 0,
  };
  return admin.database().ref().update(update);
});

exports.addNewUserPic = functions.auth.user().onCreate((event) => {
  const user = event.data;
  const url = user.photoURL;
  const fileName = user.uid;
  const tempFilePath = path.join(os.tmpdir(), fileName);
  request(url).pipe(fs.createWriteStream(tempFilePath)).on('close', () => {
    console.log(`Add New Pic for User ${fileName}`);
    return bucket.upload(tempFilePath, { destination: `profile/${fileName}` }).then(() => {
      fs.unlinkSync(tempFilePath);
    });
  });
});

exports.addWelcomeAlarm = functions.auth.user().onCreate((event) => {
  const user = event.data;
  console.log(`Add Welcome Alarm To ${user.uid}!`);
  return admin.database().ref(`/alarms/${user.uid}`).push({
    type: 'welcome',
    timestamp: admin.database.ServerValue.TIMESTAMP,
    read: false,
  });
});

exports.recordUser = functions.auth.user().onCreate((event) => {
  console.log('Record New User on Daily Basis!');
  const timekey = generateTimeKey();
  return admin.database().ref(`/records/user/${timekey}`).once('value').then((snapshot) => {
    const data = snapshot.val();
    if (data) {
      admin.database().ref(`/records/user/${timekey}`).transaction((num) => {
        if (num) {
          num += 1;
        }
        return num;
      });
    } else {
      admin.database().ref(`/records/user/${timekey}`).set(1);
    }
  });
});

exports.recordPost = functions.database.ref('/it/{pid}').onCreate((event) => {
  console.log('Record New Post on Daily Basis!');
  const timekey = generateTimeKey();
  return admin.database().ref(`/it/${event.params.pid}`).once('value').then((postSnapshot) => {
    const post = postSnapshot.val();
    if (post.name) {
      admin.database().ref(`/records/post/${timekey}/${post.name}`).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          admin.database().ref(`/records/post/${timekey}/${post.name}`).transaction((num) => {
            if (num) {
              num += 1;
            }
            return num;
          });
        } else {
          admin.database().ref(`/records/post/${timekey}/${post.name}`).set(1);
        }
      });
    }
  });
});

exports.recordKK = functions.database.ref('/it/{pid}/kk').onUpdate((event) => {
  console.log('Record KK on Daily Basis!');
  const timekey = generateTimeKey();
  return admin.database().ref(`/it/${event.params.pid}`).once('value').then((postSnapshot) => {
    const post = postSnapshot.val();
    if (post.name) {
      admin.database().ref(`/records/kk/${timekey}/${post.name}`).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          admin.database().ref(`/records/kk/${timekey}/${post.name}`).transaction((num) => {
            if (num) {
              num += 1;
            }
            return num;
          });
        } else {
          admin.database().ref(`/records/kk/${timekey}/${post.name}`).set(1);
        }
      });
    }
  });
});

exports.increaseTotalPostNum = functions.database.ref('/it/{pid}').onCreate(event => {
  console.log(`New Post(${event.params.pid}) Added! Increase Number of Post by 1!`);
  return admin.database().ref('/home/total/post').transaction((num) => {
    if (num !== null) {
      num += 1;
    }
    return num
  }).then((_) => true);
});

exports.decreaseTotalPostNum = functions.database.ref('/it/{pid}').onDelete(event => {
  console.log(`New Post(${event.params.pid}) Deleted! Decrease Number of Post by 1!`);
  return admin.database().ref('/home/total/post').transaction((num) => {
    if (num !== null) {
      num -= 1;
    }
    return num
  }).then((_) => true);
});

exports.detectTopChange = functions.database.ref('/it/{pid}/kk').onUpdate((event) => {
  return admin.database().ref(`/it/${event.params.pid}`).once('value').then((postSnapshot) => {
    const post = postSnapshot.val();
    if (post.name) {
      admin.database().ref(`/tops/${post.name}`).once('value').then((topSnapshot) => {
        const topPost = topSnapshot.val();
        if (topPost) {
          if (topPost.kk < post.kk && event.params.pid !== topPost.pid) {
            console.log(`Top post for ${post.name} changed!`);
            admin.database().ref(`/tops/${post.name}`).set({
              pid: event.params.pid,
              kk: post.kk,
            });
            admin.database().ref(`/alarms/${post.user_id}`).push({
              type: 'top',
              timestamp: admin.database.ServerValue.TIMESTAMP,
              read: false,
              it: post.name,
              pid: event.params.pid,
            });
          }
        } else {
          console.log(`New top post for ${post.name}!`);
          admin.database().ref(`/tops/${post.name}`).set({
            pid: event.params.pid,
            kk: post.kk,
          });
          admin.database().ref(`/alarms/${post.user_id}`).push({
            type: 'top',
            timestamp: admin.database.ServerValue.TIMESTAMP,
            read: false,
            it: post.name,
            pid: event.params.pid,
          });
        }
      });
    }
  });
});

exports.add100KKAlarm = functions.database.ref('/it/{pid}/kk').onUpdate((event) => {
  const kk = event.data.val();
  return admin.database().ref(`/it/${event.params.pid}`).once('value').then((postSnapshot) => {
    const post = postSnapshot.val();
    if (post.user_id && post.name) {
      if (kk > 0 && (kk % 100) === 0) {
        return admin.database().ref(`/alarms/${post.user_id}`).push({
          type: '100kk',
          timestamp: admin.database.ServerValue.TIMESTAMP,
          read: false,
          kk: kk,
          it: post.name,
          pid: event.params.pid,
        });
      }
    }
  });
});

exports.addKKAlarm = functions.database.ref('/users/{uid}/kks/{it}/{pid}').onWrite((event) => {
  const uid = event.params.uid;
  const it = event.params.it;
  const pid = event.params.pid;
  const data = event.data.val();
  if (uid !== data.uid) {
    return admin.database().ref(`/alarms/${data.uid}/${pid}`).set({
      type: 'kk',
      timestamp: admin.database.ServerValue.TIMESTAMP,
      read: false,
      kk: data.kk,
      from: data.nickname,
      it: it,
      pid: pid,
    });
  }
});

exports.increaseTotalItNum = functions.database.ref('/search/{it}').onCreate(event => {
  console.log(`New It(${event.params.it}) Added! Increase Number of It by 1!`);
  return admin.database().ref('/home/total/it').transaction((num) => {
    if (num !== null) {
      num += 1;
    }
    return num
  }).then((_) => true);
});

exports.loadThumbnail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    Jimp.read('./thumbnail.png').then((image) => {
      Jimp.loadFont('./font.fnt', (font) => {
        const fileName = `${req.query.it}.png`;
        const tempFilePath = path.join(os.tmpdir(), fileName);
        image.print(font, 10, 10, req.query.it);
        image.write(tempFilePath, () => {
          return bucket.upload(tempFilePath, { destination: `thumbnail/${fileName}` }).then(() => {
            fs.unlinkSync(tempFilePath);
            res.send('Hello World');
          });
        });
      });
    })
  });
});

/*
exports.saveUserPic = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    return admin.database().ref('/users').once('value').then((usersSnapshot) => {
      usersSnapshot.forEach((userSnapshot) => {
        const user = userSnapshot.val();
        if (user.img_url) {
          const fileName = `${userSnapshot.key}`;
          const directory = os.tmpdir();
          const tempFilePath = path.join(directory, fileName);
          request(user.img_url).pipe(fs.createWriteStream(tempFilePath)).on('close', () => {
            console.log(`Finish pic for ${fileName}`);
            return bucket.upload(tempFilePath, { destination: `profile/${fileName}` }).then(() => {
              fs.unlinkSync(tempFilePath);
            });
          })
        }
      });
    })
  });
});
*/

exports.isValid = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const url = urlencode(req.query.url);
    const api_key = 'e8ebb4da35fa0831a63ee9';
    axios.get(`http://iframe.ly/api/iframely?url=${url}&api_key=${api_key}`)
      .then((mediaRes) => {
        res.json({ valid: true });
      })
      .catch((error) => {
        res.json({ valid: false })
      });
  });
});

exports.sns = functions.https.onRequest((req, res) => {
  const ua = req.headers['user-agent'];
  const title = decodeURIComponent(req.query.title);
  const desc = decodeURIComponent(req.query.desc);
  console.log(title, desc);
  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
    res.send(
      `<head>
          <meta property="og:url" name="twitter:url" content="${req.url}">
          <meta property="og:title" name="twitter:title" content="${title}">
          <meta property="og:description" name="twitter:description" content="${desc}">
          <meta property="og:type" content="article">
          <meta property="og:image" name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/meanit-91a3c.appspot.com/o/sns-thumbnail.png?alt=media&token=f24db218-0ff8-4624-a0d9-98ce3950b71f" />
          <meta name="twitter:card" content="summary_large_image">
        </head>`
    );
  } else {
    res.redirect('https://meanit.me/');
  }
});