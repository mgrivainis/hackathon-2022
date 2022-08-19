import * as d3 from "d3";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/calendar-view
export function Calendar(
  data,
  {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    width = 300, // width of the chart, in pixels

    marginTop = 20, // top margin, in pixels
    marginRight = 80, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    cellSize = (width - marginLeft - marginRight) / 3, // width and height of an individual day, in pixels
    height = cellSize * 3 + 3 + marginTop + marginBottom,
    xDomain,
    yDomain,
    xRange = [marginLeft, width - marginRight], // [left, right]    weekday = "monday", // either: weekday, sunday, or monday
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // format specifier string for values (in the title)
    colors = d3
      .scaleSequential()
      .interpolator(d3.interpolateSpectral)
      .domain([1, 0]),
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  const I = d3.range(X.length);

  // Compute a color scale. This assumes a diverging color scheme where the pivot
  // is zero, and we want symmetric difference around zero.
  const max = d3.quantile(Y, 0.9975, Math.abs);
  const color = d3.scaleSequential([-max, +max], colors).unknown("none");

  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = Z;
  const xScale = d3.scaleTime(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange);

  const xAxis = d3.axisBottom(xScale).ticks(d3.timeDay, "%a %d");
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  // Compute titles.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);

  svg
    .append("g")
    .attr("transform", `translate(${cellSize / 2},${height - marginBottom})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${-cellSize / 2})`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove());

  const cell = svg
    .append("g")
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr("x", (i) => xScale(X[i]))
    .attr("y", (i) => yScale(Z[i]) - cellSize / 2)
    .attr("fill", (i) => {
      console.log(Y[i]);
      return color(Y[i]);
    });

  return Object.assign(svg.node(), { scales: { color } });
}
