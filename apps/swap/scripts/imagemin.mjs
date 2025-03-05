import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";

function minImage(root_path) {
  fs.readdir(root_path, function (err, pathNames) {
    pathNames.forEach((fileName) => {
      if (fileName !== ".DS_Store") {
        const path_string = `${root_path}/${fileName}`;
        const isDirectory = fs.lstatSync(path_string).isDirectory();
        if (isDirectory) {
          minImage(path_string);
        } else {
          const path_string = `${root_path}/${fileName}`;

          imagemin([path_string], {
            destination: root_path,
            plugins: [
              imageminJpegtran(),
              imageminPngquant({
                quality: [0.6, 0.8],
              }),
            ],
          });
        }
      }
    });
  });
}

minImage(path.resolve("./public/images"));
