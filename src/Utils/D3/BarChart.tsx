import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from "d3";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { countryPopulation } from "../../assets/csvData/countryPopulation";
function BarChart() {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setheight] = useState(400);

  useEffect(() => {
    const margin: Margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 200,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const getXValue = (value: CountryPopulation) => value.population;
    const getYValue = (value: CountryPopulation) => value.country;
	console.log(countryPopulation
		.map((x) => {
		  const population = x[x.length - 1];
		  return { country: String(x[0]), population: typeof population === "number" ? population : 0, countryCode: String(x[1]) };
		})
		//.filter(getXValue)
		.sort((a, b) => getXValue(b) - getXValue(a)))
    const rows: CountryPopulation[] = countryPopulation
      .map((x) => {
        const population = x[x.length - 1];
        return { country: String(x[0]), population: typeof population === "number" ? population : 0, countryCode: String(x[1]) };
      })
      //.filter(getXValue)
      .sort((a, b) => getXValue(b) - getXValue(a))
      .splice(0, 20);
    const xScale = scaleLinear(rows.map(getXValue))
      .domain([0, max(rows, getXValue) ?? 0])
      .range([0, innerWidth]);

    const yScale = scaleBand().domain(rows.map(getYValue)).range([0, innerHeight]).padding(0.2);
	const svg = select(ref.current);
	svg.selectAll('*').remove();
    const barsGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    barsGroup.append("g").call(axisLeft(yScale));
    barsGroup.append("g").call(axisBottom(xScale)).attr("transform", `translate(0, ${innerHeight})`);

    barsGroup
      .selectAll("rect")
      .data(rows)
      .join("rect")
      .attr("y", (d) => yScale(getYValue(d))!)
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(getXValue(d)));
  }, []);

  return (
    <>
      <svg height={height} width={width} ref={ref}></svg>
    </>
  );
}

export default BarChart;

export interface CountryPopulation {
  country: string;
  population: number;
  countryCode: string;
}

export type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
