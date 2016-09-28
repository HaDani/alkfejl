"use strict";

const fs = require('fs');
const jimp = require('jimp');
const DataStore = require('nedb-promise');
const co = require('co');

const db = new DataStore({
    filename: 'images.nedb',
    autoload: true,

});

function readdir(path) {
    return new Promise(function (resolve, reject) {
        fs.readdir('gyak2/images/', function (err, files) {
            if (err) return reject(err);
            resolve(files);
        });
    });
}

function processFile(fileName) {
    let theImage;
    return jimp.read(`gyak2/images/${fileName}`)
        .then(function (image) {
            theImage = image;
            const {width, height} = image.bitmap;
            return db.insert({ fileName, width, height });
        })
        .then(function (insertedImage) {
            theImage.resize(100, jimp.AUTO);
            return theImage.write(`gyak2/converted/${insertedImage._id}`);
        })
        .then(function () {
            console.log(fileName, 'feldolgozva');
        });
}


co(function* () {
    try {
        const numRemoved = yield db.remove({}, { multi: true });
        console.log('gyak2/images');
        const files = yield readdir('gyak2/images');
        yield Promise.all(files.map(co.wrap(function* (fileName) {
            const image = yield jimp.read(`gyak2/images/${fileName}`);
            const {width, height} = image.bitmap;
            const insertedImage = yield db.insert({fileName, width, height});
            image.resize(100, jimp.AUTO);
            image.write(`gyak2/converted/${insertedImage._id}.png`);
            console.log(fileName, 'feldolgozva');
        })));
        console.log('VEGE');
    } catch (err) {
        console.log(err);
    }
});

/*db.remove({}, { multi: true })
    .then(function (numRemoved) {
        console.log(numRemoved, " törölve!");
        return;
    })
    .then(function () {
        return readdir('gyak2/images/');
    })
    .then(function (files) {
        return Promise.all(files.map(processFile));
    })
    .then(function () {
        console.log('VEGE');
    })
    .catch(function (err) {
        console.log(err);
    });



/*db.remove({}, { multi: true }, function (err, numRemoved) {
    if (err) throw err;

    fs.readdir('gyak2/images/', function (err, files) {
        if (err) throw err;

        let count = files.length;

        //console.log(files);

        files.forEach(function (fileName) {
            //console.log(fileName);
            jimp.read(`gyak2/images/${fileName}`, function (err, image) {
                if (err) throw err;
                console.log(image);
                /* const width = image.bitmap.width;
                 const height = image.bitmap.height;*/

            /*    const {width, height} = image.bitmap;

                db.insert({ fileName, width, height }, function (err, insertedImage) {
                    if (err) throw err;

                    console.log(insertedImage);
                    image.resize(100, jimp.AUTO);
                    image.write(`gyak2/converted/${insertedImage._id}.png`, function (err) {
                        if (err) throw err;

                        console.log(fileName, 'feldolgozva');
                        count--;
                        if (count === 0) {
                            console.log('Vege');
                        }
                    })
                });
            })
        })
    });
});

/*fs.readdir('gyak2/images/', function (err, files) {
   if (err) throw err;

   //console.log(files);

   files.forEach(function (fileName) {
       //console.log(fileName);
       jimp.read(`gyak2/images/${fileName}`, function (err, image) {
           if (err) throw err;
           console.log(image);
           const width = image.bitmap.width;
           const height = image.bitmap.height;

           const {width, height} = image.bitmap;

           db.insert({fileName, width, height}, function(err, insertedImage) {
                if (err) throw err;

               console.log(insertedImage);
               image.resize(100, jimp.AUTO);
               image.write(`gyak2/converted/${insertedImage._id}.png`, function (err) {
                              if (err) throw err;

                   console.log(fileName, 'feldolgozva');
               })
           });
       })
   }) 
});*/