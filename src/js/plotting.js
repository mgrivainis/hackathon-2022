import { flatMap, map, reduce, values } from "lodash";
import { DonutChart } from "./donutChart";
import { Calendar } from "./calendar";
import * as d3 from "d3";

const json = require("../data/tmp_data.json");

export function buildPlot() {
  const types = json.data[0].types;
  const plants = json.data[0].plants;

  const todayData = map(plants, (v, k) => {
    const result = {};
    result.name = k;
    result.value = v.index.value;
    return result;
  }).filter((dataPoint) => dataPoint.value !== null);

  const result = DonutChart(todayData, {
    name: (d) => d.name,
    value: (d) => d.value,
    width: 300,
    height: 300,
  });

  document.body.appendChild(result);

  var format = d3.timeParse("%Y-%m-%d");

  const historyData = flatMap(json.data, (day) => {
    return reduce(
      day.types,
      (r, v, k) => {
        r.push({
          name: k,
          value: v.index.value,
          date: format(day.date),
        });
        return r;
      },
      []
    );
  });

  console.log(historyData);

  const historic = Calendar(historyData, {
    x: (d) => d.date,
    y: (d) => d.value,
    z: (d) => d.name,
    yLabel: "Pollen Count",
    yDomain: d3.groupSort(
      historyData,
      ([d]) => -d.value,
      (d) => d.name
    ),
  });
  document.body.appendChild(historic);

  const todayPlants = map(plants, (v, k) => {
    const result = {};
    result.name = k;
    result.value = v.index.value;
    return result;
  }).filter((dataPoint) => dataPoint.value !== null);
  console.log(todayPlants);
}
