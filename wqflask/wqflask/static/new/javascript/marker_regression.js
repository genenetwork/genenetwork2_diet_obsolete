// Generated by CoffeeScript 1.3.3
(function() {

  $(function() {
    var Manhattan_Plot;
    Manhattan_Plot = (function() {

      function Manhattan_Plot() {
        this.qtl_results = js_data.qtl_results;
        this.max_chr = this.get_max_chr();
        this.plot_height = 500;
        this.plot_width = 1000;
        this.x_coords = [];
        this.y_coords = [];
        this.marker_names = [];
        this.get_coordinates();
        this.x_max = d3.max(this.x_coords);
        this.y_max = d3.max(this.y_coords);
        this.plot_coordinates = _.zip(this.x_coords, this.y_coords, this.marker_names);
        this.create_graph();
      }

      Manhattan_Plot.prototype.get_max_chr = function() {
        var chr, max_chr, result, _i, _len, _ref;
        max_chr = 0;
        _ref = this.qtl_results;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          chr = parseInt(result.chr);
          console.log("foo:", chr, typeof chr);
          if (!_.isNaN(chr)) {
            if (chr > max_chr) {
              max_chr = chr;
            }
          }
        }
        return max_chr;
      };

      Manhattan_Plot.prototype.get_coordinates = function() {
        var chr, result, _i, _len, _ref, _results;
        _ref = js_data.qtl_results;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          chr = parseInt(result.chr);
          if (_.isNaN(chr)) {
            if (result.chr === "X") {
              chr = this.max_chr + 1;
            } else if (result.chr === "Y") {
              chr = this.max_chr + 2;
            }
          }
          this.x_coords.push(((chr - 1) * 200) + parseFloat(result.Mb));
          this.y_coords.push(result.lrs_value);
          _results.push(this.marker_names.push(result.name));
        }
        return _results;
      };

      Manhattan_Plot.prototype.display_info = function(d) {
        return $("#coords").text(d[1]);
      };

      Manhattan_Plot.prototype.create_graph = function() {
        var svg, x, y,
          _this = this;
        svg = d3.select("#manhattan_plots").append("svg").style('border', '2px solid black').attr("width", this.plot_width).attr("height", this.plot_height);
        svg.selectAll("text").data(this.plot_coordinates).enter().append("text").attr("x", function(d) {
          return _this.plot_width * d[0] / _this.x_max;
        }).attr("y", function(d) {
          return _this.plot_height - ((0.8 * _this.plot_height) * d[1] / _this.y_max);
        }).text(function(d) {
          return d[2];
        }).attr("font-family", "sans-serif").attr("font-size", "12px").attr("fill", "black");
        svg.selectAll("circle").data(this.plot_coordinates).enter().append("circle").attr("cx", function(d) {
          return _this.plot_width * d[0] / _this.x_max;
        }).attr("cy", function(d) {
          return _this.plot_height - ((0.8 * _this.plot_height) * d[1] / _this.y_max);
        }).attr("r", 2).classed("circle", true).on("mouseover", function(d) {
          return d3.select(d3.event.target).classed("d3_highlight", true).attr("r", 5).attr("fill", "yellow").call(_this.display_info(d));
        }).on("mouseout", function() {
          return d3.select(d3.event.target).classed("d3_highlight", false).attr("r", 2).attr("fill", "black");
        }).attr("title", "foobar");
        x = d3.scale.linear().domain([0, this.x_max]).range([0, this.plot_width]);
        y = d3.scale.linear().domain([0, this.y_max]).range([0, this.plot_height]);
        return svg.selectAll("line").data(x.ticks(this.max_chr)).enter().append("line").attr("x1", x).attr("x2", x).attr("y1", 0).attr("y2", this.plot_height).style("stroke", "#ccc");
      };

      return Manhattan_Plot;

    })();
    return new Manhattan_Plot;
  });

}).call(this);
