// Generated by CoffeeScript 1.7.1
var get_data, get_options, root;

root = typeof exports !== "undefined" && exports !== null ? exports : this;

$(function() {
  var chartOpts, data, mychart;
  console.log("js_data:", js_data);
  chartOpts = get_options();
  data = get_data();
  console.log(data);
  return mychart = corr_matrix(data, chartOpts);
});

get_options = function() {
  var chartOpts;
  chartOpts = {
    cortitle: "Correlation Matrix",
    scattitle: "Scatterplot",
    h: 450,
    w: 450,
    margin: {
      left: 100,
      top: 40,
      right: 5,
      bottom: 70,
      inner: 5
    }
  };
  return chartOpts;
};

get_data = function() {
  var data;
  data = {};
  data["var"] = js_data.traits;
  data.group = js_data.groups;
  data.indID = js_data.samples;
  data.dat = js_data.sample_data;
  data.corr = js_data.corr_results;
  data.cols = js_data.cols;
  data.rows = js_data.rows;
  return data;
};
