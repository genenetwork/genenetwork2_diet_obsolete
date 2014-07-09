// Generated by CoffeeScript 1.7.1
var root;

root = typeof exports !== "undefined" && exports !== null ? exports : this;

root.create_scatterplot = function(json_ids, json_data) {
  var data, h, halfh, halfw, indID, margin, mychart, totalh, totalw, w;
  console.log("TESTING2");
  h = 400;
  w = 500;
  margin = {
    left: 60,
    top: 40,
    right: 40,
    bottom: 40,
    inner: 5
  };
  halfh = h + margin.top + margin.bottom;
  totalh = halfh * 2;
  halfw = w + margin.left + margin.right;
  totalw = halfw * 2;
  mychart = scatterplot().xvar(0).yvar(1).xlab("X").ylab("Y").height(h).width(w).margin(margin);
  data = json_data;
  indID = json_ids;
  d3.select("div#comparison_scatterplot").datum({
    data: data,
    indID: indID
  }).call(mychart);
  return mychart.pointsSelect().on("mouseover", function(d) {
    return d3.select(this).attr("r", mychart.pointsize() * 3);
  }).on("mouseout", function(d) {
    return d3.select(this).attr("r", mychart.pointsize());
  });
};

root.create_scatterplots = function(trait_names, json_ids, json_data) {
  var brush, brushend, brushmove, brushstart, chart, data, h, halfh, halfw, i, indID, margin, mychart, num_traits, svg, totalh, totalw, w, xscale, xshift, xvar, yscale, yshift, yvar, _i, _j, _k, _ref, _ref1, _ref2, _results;
  console.log("json_data:", json_data);
  console.log("trait_names:", trait_names);
  num_traits = json_data.length;
  console.log("num_traits:", num_traits);
  h = 300;
  w = 400;
  margin = {
    left: 60,
    top: 40,
    right: 40,
    bottom: 40,
    inner: 5
  };
  halfh = h + margin.top + margin.bottom;
  totalh = halfh * (num_traits - 1);
  halfw = w + margin.left + margin.right;
  totalw = halfw;
  xvar = [];
  yvar = [];
  xshift = [];
  yshift = [];
  for (i = _i = 0, _ref = num_traits - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    xvar.push(i);
    yvar.push(0);
    xshift.push(0);
    yshift.push(halfh * i);
  }
  console.log("xvar:", xvar);
  console.log("yvar:", yvar);
  svg = d3.select("div#comparison_scatterplot").append("svg").attr("height", totalh).attr("width", totalw);
  mychart = [];
  chart = [];
  for (i = _j = 1, _ref1 = num_traits - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
    mychart[i - 1] = scatterplot().xvar(xvar[i]).yvar(yvar[i]).nxticks(6).height(h).width(w).margin(margin).pointsize(4).xlab("" + trait_names[i - 1]).ylab("" + trait_names[0]).title("" + trait_names[0] + " vs. " + trait_names[i - 1]);
    data = json_data;
    indID = json_ids;
    chart[i - 1] = svg.append("g").attr("id", "chart" + (i - 1)).attr("transform", "translate(" + xshift[i] + "," + yshift[i - 1] + ")");
    chart[i - 1].datum({
      data: data,
      indID: indID
    }).call(mychart[i - 1]);
  }
  brush = [];
  brushstart = function(i) {
    return function() {
      var j, _k, _ref2;
      for (j = _k = 0, _ref2 = num_traits - 2; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
        if (j !== i) {
          chart[j].call(brush[j].clear());
        }
      }
      return svg.selectAll("circle").attr("opacity", 0.6).classed("selected", false);
    };
  };
  brushmove = function(i) {
    return function() {
      var e;
      svg.selectAll("circle").classed("selected", false);
      e = brush[i].extent();
      return chart[i].selectAll("circle").classed("selected", function(d, j) {
        var circ, cx, cy, selected;
        circ = d3.select(this);
        cx = circ.attr("cx");
        cy = circ.attr("cy");
        selected = e[0][0] <= cx && cx <= e[1][0] && e[0][1] <= cy && cy <= e[1][1];
        if (selected) {
          svg.selectAll("circle.pt" + j).classed("selected", true);
        }
        return selected;
      });
    };
  };
  brushend = function() {
    return svg.selectAll("circle").attr("opacity", 1);
  };
  xscale = d3.scale.linear().domain([margin.left, margin.left + w]).range([margin.left, margin.left + w]);
  yscale = d3.scale.linear().domain([margin.top, margin.top + h]).range([margin.top, margin.top + h]);
  _results = [];
  for (i = _k = 0, _ref2 = num_traits - 2; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
    brush[i] = d3.svg.brush().x(xscale).y(yscale).on("brushstart", brushstart(i)).on("brush", brushmove(i)).on("brushend", brushend);
    _results.push(chart[i].call(brush[i]));
  }
  return _results;
};
