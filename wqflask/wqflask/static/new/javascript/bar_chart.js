// Generated by CoffeeScript 1.6.1
(function() {
  var Bar_Chart, root,
    __hasProp = {}.hasOwnProperty;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Bar_Chart = (function() {

    function Bar_Chart(sample_list, attribute_names) {
      var longest_sample_name, sample,
        _this = this;
      this.sample_list = sample_list;
      this.attribute_names = attribute_names;
      this.get_samples();
      console.log("sample names:", this.sample_names);
      longest_sample_name = d3.max((function() {
        var _i, _len, _ref, _results;
        _ref = this.sample_names;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sample = _ref[_i];
          _results.push(sample.length);
        }
        return _results;
      }).call(this));
      this.margin = {
        top: 20,
        right: 20,
        bottom: longest_sample_name * 7,
        left: 40
      };
      this.plot_width = this.sample_vals.length * 15 - this.margin.left - this.margin.right;
      this.plot_height = 500 - this.margin.top - this.margin.bottom;
      this.x_buffer = this.plot_width / 20;
      this.y_buffer = this.plot_height / 20;
      this.y_min = d3.min(this.sample_vals);
      this.y_max = d3.max(this.sample_vals) * 1.1;
      this.svg = this.create_svg();
      this.plot_height -= this.y_buffer;
      this.create_scales();
      this.create_graph();
      d3.select("#color_attribute").on("change", function() {
        var attribute;
        attribute = $("#color_attribute").val();
        if ($("#update_bar_chart").html() === 'Sort By Name') {
          return _this.svg.selectAll(".bar").data(_this.sorted_samples()).transition().duration(1000).style("fill", function(d) {
            if (attribute === "None") {
              return "steelblue";
            } else {
              return _this.attr_color_dict[attribute][d[2][attribute]];
            }
          }).select("title").text(function(d) {
            return d[1];
          });
        } else {
          return _this.svg.selectAll(".bar").data(_this.samples).transition().duration(1000).style("fill", function(d) {
            if (attribute === "None") {
              return "steelblue";
            } else {
              return _this.attr_color_dict[attribute][d[2][attribute]];
            }
          });
        }
      });
      d3.select("#update_bar_chart").on("click", function() {
        var attribute, sortItems, sorted_sample_names, x_scale;
        if (_this.attributes.length > 0) {
          attribute = $("#color_attribute").val();
        }
        if ($("#update_bar_chart").html() === 'Sort By Value') {
          $("#update_bar_chart").html('Sort By Name');
          sortItems = function(a, b) {
            return a[1] - b[1];
          };
          _this.svg.selectAll(".bar").data(_this.sorted_samples()).transition().duration(1000).attr("y", function(d) {
            return _this.y_scale(d[1]);
          }).attr("height", function(d) {
            return _this.plot_height - _this.y_scale(d[1]);
          }).style("fill", function(d) {
            if (_this.attributes.length > 0 && attribute !== "None") {
              return _this.attr_color_dict[attribute][d[2][attribute]];
            } else {
              return "steelblue";
            }
          }).select("title").text(function(d) {
            return d[1];
          });
          sorted_sample_names = (function() {
            var _i, _len, _ref, _results;
            _ref = this.sorted_samples();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sample = _ref[_i];
              _results.push(sample[0]);
            }
            return _results;
          }).call(_this);
          x_scale = d3.scale.ordinal().domain(sorted_sample_names).rangeBands([0, _this.plot_width], .1);
          $('.x.axis').remove();
          return _this.add_x_axis(x_scale);
        } else {
          $("#update_bar_chart").html('Sort By Value');
          _this.svg.selectAll(".bar").data(_this.samples).transition().duration(1000).attr("y", function(d) {
            return _this.y_scale(d[1]);
          }).attr("height", function(d) {
            return _this.plot_height - _this.y_scale(d[1]);
          }).style("fill", function(d) {
            if (_this.attributes.length > 0 && attribute !== "None") {
              return _this.attr_color_dict[attribute][d[2][attribute]];
            } else {
              return "steelblue";
            }
          }).select("title").text(function(d) {
            return d[1];
          });
          x_scale = d3.scale.ordinal().domain(_this.sample_names).rangeBands([0, _this.plot_width], .1);
          $('.x.axis').remove();
          return _this.add_x_axis(x_scale);
        }
      });
      d3.select("#color_by_trait").on("click", function() {
        return _this.color_by_trait();
      });
    }

    Bar_Chart.prototype.get_attr_color_dict = function() {
      var attribute_info, color, i, key, this_color_dict, value, _i, _len, _ref, _ref1, _results;
      color = d3.scale.category20();
      this.attr_color_dict = {};
      console.log("attribute_names:", this.attribute_names);
      _ref = this.attribute_names;
      _results = [];
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        attribute_info = _ref[key];
        this_color_dict = {};
        _ref1 = attribute_info.distinct_values;
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          value = _ref1[i];
          this_color_dict[value] = color(i);
        }
        _results.push(this.attr_color_dict[attribute_info.name] = this_color_dict);
      }
      return _results;
    };

    Bar_Chart.prototype.get_samples = function() {
      var attr_vals, attribute, key, sample, _i, _j, _len, _len1, _ref, _ref1;
      this.sample_names = (function() {
        var _i, _len, _ref, _results;
        _ref = this.sample_list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sample = _ref[_i];
          if (sample.value !== null) {
            _results.push(sample.name);
          }
        }
        return _results;
      }).call(this);
      this.sample_vals = (function() {
        var _i, _len, _ref, _results;
        _ref = this.sample_list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sample = _ref[_i];
          if (sample.value !== null) {
            _results.push(sample.value);
          }
        }
        return _results;
      }).call(this);
      this.attributes = (function() {
        var _results;
        _results = [];
        for (key in this.sample_list[0]["extra_attributes"]) {
          _results.push(key);
        }
        return _results;
      }).call(this);
      console.log("attributes:", this.attributes);
      this.sample_attr_vals = [];
      if (this.attributes.length > 0) {
        _ref = this.sample_list;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sample = _ref[_i];
          attr_vals = {};
          _ref1 = this.attributes;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            attribute = _ref1[_j];
            attr_vals[attribute] = sample["extra_attributes"][attribute];
          }
          this.sample_attr_vals.push(attr_vals);
        }
      }
      this.samples = _.zip(this.sample_names, this.sample_vals, this.sample_attr_vals);
      this.get_attr_color_dict();
      return console.log("samples:", this.samples);
    };

    Bar_Chart.prototype.create_svg = function() {
      var svg;
      svg = d3.select("#bar_chart").append("svg").attr("class", "bar_chart").attr("width", this.plot_width + this.margin.left + this.margin.right).attr("height", this.plot_height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      return svg;
    };

    Bar_Chart.prototype.create_scales = function() {
      this.x_scale = d3.scale.ordinal().domain(this.sample_names).rangeBands([0, this.plot_width], .1);
      return this.y_scale = d3.scale.linear().domain([this.y_min * 0.75, this.y_max]).range([this.plot_height, this.y_buffer]);
    };

    Bar_Chart.prototype.create_graph = function() {
      this.add_x_axis(this.x_scale);
      this.add_y_axis();
      return this.add_bars();
    };

    Bar_Chart.prototype.add_x_axis = function(scale) {
      var xAxis,
        _this = this;
      xAxis = d3.svg.axis().scale(scale).orient("bottom");
      return this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + this.plot_height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").style("font-size", "12px").attr("dx", "-.8em").attr("dy", "-.3em").attr("transform", function(d) {
        return "rotate(-90)";
      });
    };

    Bar_Chart.prototype.add_y_axis = function() {
      var yAxis;
      yAxis = d3.svg.axis().scale(this.y_scale).orient("left").ticks(5);
      return this.svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end");
    };

    Bar_Chart.prototype.add_bars = function() {
      var _this = this;
      return this.svg.selectAll(".bar").data(this.samples).enter().append("rect").style("fill", "steelblue").attr("class", "bar").attr("x", function(d) {
        return _this.x_scale(d[0]);
      }).attr("width", this.x_scale.rangeBand()).attr("y", function(d) {
        return _this.y_scale(d[1]);
      }).attr("height", function(d) {
        return _this.plot_height - _this.y_scale(d[1]);
      }).append("svg:title").text(function(d) {
        return d[1];
      });
    };

    Bar_Chart.prototype.sorted_samples = function() {
      var sample_list, sorted,
        _this = this;
      sample_list = _.zip(this.sample_names, this.sample_vals, this.sample_attr_vals);
      sorted = _.sortBy(sample_list, function(sample) {
        return sample[1];
      });
      console.log("sorted:", sorted);
      return sorted;
    };

    Bar_Chart.prototype.color_by_trait = function() {
      console.log("Before load");
      $('#collections_holder').load('/collections/list #collections_list');
      $.colorbox({
        inline: true,
        href: "#collections_holder"
      });
      return console.log("After load");
    };

    return Bar_Chart;

  })();

  root.Bar_Chart = Bar_Chart;

}).call(this);
