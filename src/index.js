import zipLatLongCSV from "./data/zip-lat-long.csv";
import "./style.css";
import { buildPlot } from "./js/plotting";
import { getBreezometerData } from "./js/breezometer";

const zipLatLongMap = {};

zipLatLongCSV.forEach((item) => {
  zipLatLongMap[item.ZIP] = [item.LAT, item.LNG];
});

function zipCodeInputComponent(onValidZipCode) {
  const containerElement = document.createElement("div");
  containerElement.classList.add('zipcode');

  const input = document.createElement("input");
  input.classList.add('zipcode__input');
  input.placeholder = 'Enter a Zipcode';
  input.maxLength = 5;

  const zipCodeExp = /^\d{5}$/;

  input.addEventListener('input', (e) => {
    const value = input.value.trim();

    if (zipCodeExp.test(value)) {
      onValidZipCode(value);
    }
  });

  containerElement.appendChild(input);

  return containerElement;
}

function getData (zip) {
  const [lat, long] = zipLatLongMap[zip];

  getBreezometerData(lat, long).then(
    (result) => {
      console.log(result);
    },
    () => {
      console.log('error');
    });
}

document.body.appendChild(zipCodeInputComponent(getData));

buildPlot();
