import { useEffect, useState } from "react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (imageData) {
      const image = document.createElement("img");
      image.src = imageData as string;
      image.onload = () => {
        // Create an OffscreenCanvas and draw the ImageBitmap on it
        const canvas = new OffscreenCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0);

          // Get the pixel data
          const imageData = ctx.getImageData(0, 0, image.width, image.height);
          const pixelData = imageData.data;

          // Convert the pixel data to an array of numbers
          const values = [];
          for (let i = 0; i < pixelData.length; i += 4) {
            const value = pixelData[i] + pixelData[i + 1] + pixelData[i + 2];
            values.push(value / 3 > 125 ? 0 : 1);
          }
          console.log(values);
        }
      };
    }
  }, [imageData]);
  return (
    <div>
      <h1>NFT Miner</h1>
      <input
        type="file"
        id="img"
        name="img"
        accept="image/*"
        multiple={false}
        onChange={(event) => {
          const { files } = event.target;
          if (files && files.length > 0) {
            const file = files[0] as File;
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setImageData(reader.result);
            });
            reader.readAsDataURL(file);
          }
        }}
      ></input>
    </div>
  );
};

export default Home;
