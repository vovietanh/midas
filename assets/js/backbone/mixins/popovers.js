define([
  'jquery',
  'underscore',
  'backbone',
  'base_component',
  'bootstrap',
  'text!popover_profile'
], function ($, _, Backbone, BaseComponent, Bootstrap, PopoverProfile) {

  Application.Component.Popovers = BaseComponent.extend({

    popoverPeopleInit: function (target) {
      $(target).popover(
        {
          placement: 'auto top',
          trigger: 'manual',
          html: 'true',
          title: 'load',
          container: 'body',
          content: '<div class="popover-spinner"><div class="loading">Fetching Information</div><i class="icon-spinner icon-spin"></i></div>',
          template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title" style="display:none; visibility:hidden"></h3><div class="popover-content"></div></div>'
        }).on("mouseleave", function () {
          var _this = this;
          var timeoutFn = function () {
            if (!$(".popover:hover").length) {
                $(_this).popover("hide")
            } else {
              setTimeout(timeoutFn, 100);
            }
          };
          setTimeout(timeoutFn, 100);
        });
    },

    popoverPeopleOn: function (e) {
      if (e.preventDefault) e.preventDefault();
      var target = $(e.currentTarget);
      var popover = target.data('bs.popover');
      target.popover('show');
      // Only load data if the popover hasn't previously been loaded
      if (popover.options.title == 'load') {
        $.ajax({ url: '/api/user/info/' + target.data('userid') }).done(function(data) {
          var template = _.template(PopoverProfile, {data: data});
          popover.options.title = 'done';
          popover.options.content = template;
          popover.setContent();
          popover.$tip.addClass(popover.options.placement);
        });
      }
    }
  });

  return Application.Component.Popovers;
});
