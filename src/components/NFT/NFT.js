import React from "react";
import { ReactSVG } from "react-svg";
import "./NFT.css";

const randomColor = require("randomcolor"); // import the script

class NFT extends React.Component {
  constructor(props) {
    super(props);

    let baseImgPath = "";
    let featureValues = [];

    let basicFeatures = props.dna.toString().substring(0, 4);

    featureValues.push(+basicFeatures.substring(0, 2));
    featureValues.push(+basicFeatures.substring(2, 3));
    featureValues.push(+basicFeatures.substring(3, 4));

    let featureString = props.dna.toString().substring(4, props.dna.length);
    for (var i = 0; i < 12; i += 2) {
      featureValues.push(+featureString.substring(i, i + 2));
    }

    console.log(featureValues);

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
        baseImgPath = "images/City.svg";
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

    const map = (value, x1, y1, x2, y2) =>
      ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

    const fgHue = Math.floor(map(featureValues[5], 0, 99, 0, 7));
    const bgHue = Math.floor(map(featureValues[6], 0, 99, 0, 7));

    const featureColors = randomColor({
      count: 10,
      hue: hues[fgHue],
      seed: featureValues[3],
    });

    const bgColors = randomColor({
      count: 2,
      hue: hues[bgHue],
      seed: featureValues[4],
    });

    this.state = {
      imageBase: baseImgPath,
      background1: bgColors[0],
      background2: bgColors[1],
      feature1: featureColors[0],
      feature2: featureColors[1],
      feature3: featureColors[2],
      feature4: featureColors[3],
      feature5: featureColors[4],
      feature6: featureColors[5],
      className: "nft_" + Math.random().toString(36).substr(2, 5),
    };
  }

  render(props) {
    return (
      <>
        <ReactSVG className={this.state.className} src={this.state.imageBase} />
        <style
          dangerouslySetInnerHTML={{
            __html: [
              "." + this.state.className + " .background-1 {",
              "  stop-color: " + this.state.background1 + " !important;",
              "}",
              "." + this.state.className + " .background-2 {",
              "  stop-color: " + this.state.background2 + " !important;",
              "}",
              "." + this.state.className + " .feature-1 {",
              "  fill: " + this.state.feature1 + " !important;",
              "}",
              "." + this.state.className + " .feature-2 {",
              "  fill: " + this.state.feature2 + " !important;",
              "}",
              "." + this.state.className + " .feature-3 {",
              "  fill: " + this.state.feature3 + " !important;",
              "}",
              "." + this.state.className + " .feature-4 {",
              "  fill: " + this.state.feature4 + " !important;",
              "}",
              "." + this.state.className + " .feature-5 {",
              "  fill: " + this.state.feature5 + " !important;",
              "}",
              "." + this.state.className + " {",
              "width: 300px; height: 300px;",
              "}",
              "." + this.state.className + "> svg {",
              "width: 100%; height: 100%;",
              "}",
            ].join("\n"),
          }}
        ></style>
      </>
    );
  }
}

export default NFT;
