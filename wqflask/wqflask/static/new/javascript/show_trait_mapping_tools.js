// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var composite_mapping_fields, submit_special, toggle_enable_disable,
      _this = this;
    submit_special = function() {
      var url;
      console.log("In submit_special");
      console.log("this is:", this);
      console.log("$(this) is:", $(this));
      url = $(this).data("url");
      console.log("url is:", url);
      $("#trait_data_form").attr("action", url);
      return $("#trait_data_form").submit();
    };
    $("#marker_regression").click(function() {
      var url;
      $("#progress_bar_container").modal();
      url = "/marker_regression";
      $.ajax({
        type: "POST",
        url: url,
        data: $("#trait_data_form").serialize(),
        success: function(data) {
          $('#progress_bar_container').modal('hide');
          return $("body").html(data);
        }
      });
      return false;
    });
    composite_mapping_fields = function() {
      return $(".composite_fields").toggle();
    };
    $("#use_composite_choice").change(composite_mapping_fields);
    toggle_enable_disable = function(elem) {
      return $(elem).prop("disabled", !$(elem).prop("disabled"));
    };
    $("#choose_closet_control").change(function() {
      return toggle_enable_disable("#control_locus");
    });
    return $("#display_all_lrs").change(function() {
      return toggle_enable_disable("#suggestive_lrs");
    });
  });

}).call(this);
