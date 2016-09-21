"use strict";

const fs = require('fs');
const jimp = require('jimp');
const DataStore = require('nedb');

const db = new DataStore({
    filename: 'images.nedb',
    autoload: true,

});


db.remove({}, { multi: true }, function (err, numRemoved) {
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

                const {width, height} = image.bitmap;

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