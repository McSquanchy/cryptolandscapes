import "./NFT.css";
import React from "react";
import { ReactSVG } from "react-svg";

const randomColor = require("randomcolor"); // import the script

export default function NFT(props) {
  let baseImgPath = "";
  let featureValues = [];

  for (var i = 0; i < 16; i += 2) {
    if (i === 2 || i === 4) {
      featureValues.push(+props.dna.substring(i, i + 1));
      featureValues.push(+props.dna.substring(i + 1, i + 2));
    } else featureValues.push(+props.dna.substring(i, i + 2));
  }

  switch (featureValues[0]) {
    case 11:
      baseImgPath = "images/Mars.svg";
      break;
    case 12:
      baseImgPath = "images/Galaxy.svg";
      break;
    case 13:
      baseImgPath = "images/Farm.svg";
      break;
    case 14:
      baseImgPath = "images/Fantasy.svg";
      break;
    default:
      baseImgPath = "images/Mars.svg";
  }

  const hues = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "monochrome",
  ];

  const featureColors = randomColor({
    count: 8,
    hue: hues[featureValues[1] % 8],
    seed: featureValues[3],
  });

  const bgColors = randomColor({
    count: 2,
    hue: hues[featureValues[2] % 8],
    seed: featureValues[4],
  });

  const className = "nft_" + Math.random().toString(36).substr(2, 5);

  return (
    <>
      <ReactSVG className={className} src={baseImgPath} />
      <style
        dangerouslySetInnerHTML={{
          __html: [
            "." + className + " .background-1 {",
            "  stop-color: " + bgColors[0] + " !important;",
            "}",
            "." + className + " .background-2 {",
            "  stop-color: " + bgColors[1] + " !important;",
            "}",
            "." + className + " .feature-1 {",
            "  fill: " + featureColors[0] + " !important;",
            "}",
            "." + className + " .feature-2 {",
            "  fill: " + featureColors[1] + " !important;",
            "}",
            "." + className + " .feature-3 {",
            "  fill: " + featureColors[2] + " !important;",
            "}",
            "." + className + " .feature-4 {",
            "  fill: " + featureColors[3] + " !important;",
            "}",
            "." + className + " .feature-5 {",
            "  fill: " + featureColors[4] + " !important;",
            "}",
            "." + className + " {",
            "width: 300px;",
            "}",
            "." + className + "> svg {",
            "width: 100%; height: 100%",
            "}",
          ].join("\n"),
        }}
      ></style>
    </>
  );
}
