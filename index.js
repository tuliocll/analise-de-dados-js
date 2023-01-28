import { tidy, mutate, count } from "@tidyjs/tidy";
import moment from "moment";
import csv from "csvtojson";
import { promises as fs } from "fs";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const data = await csv().fromFile(
  "/Users/tuliocalil/projetosJs/nodejs/tidyjs/bike_data.csv"
);

const results = tidy(
  data,
  mutate({ start_hour: (d) => moment(d.starttime).minutes(0).format("LT") }),
  count("start_hour", { name: "count" })
);

const configuration = {
  type: "bar",
  data: {
    datasets: [
      {
        label: "Bikes",
        data: results,
        borderColor: "#FFA500",
        backgroundColor: "#FFCD28",
        borderWidth: 2,
      },
    ],
  },
  options: {
    parsing: {
      xAxisKey: "start_hour",
      yAxisKey: "count",
    },
  },
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width: 400,
  height: 400,
});

const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
await fs.writeFile("./grafico.png", buffer, "base64");
