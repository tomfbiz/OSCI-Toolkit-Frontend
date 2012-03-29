jQuery(function() {
	window.OsciTkToolbarItemView = OsciTkView.extend({
		className: 'toolbar-item',
		template: _.template($('#template-toolbar-item').html()),
		initialize: function() {
			// add a class to this element based on view button uses
			this.$el.addClass(this.options.toolbarItem.view + '-toolbar-item');
			// tracks the view to render in the content area when this view is clicked
			this.contentView = null;
			this.contentViewRendered = false;			
		},
		events: {
			'click': 'itemClicked'
		},
		render: function() {
			var options = {dispatcher: this.dispatcher, parent: this};
			this.contentView = new window[this.options.toolbarItem.view](options);
			this.parent.addView(this.contentView, '#toolbar-content');
			this.$el.html(this.template({
				text: this.options.toolbarItem.text
			}));
		},
		itemClicked: function() {
			if (!this.contentViewRendered) {
				this.contentView.render();
				this.contentViewRendered = true;
			}
			
			// // if content view hasn't been instantiated yet, do so and add it to the toolbar view
			// if (this.contentView === null) {
			// 	var options = {dispatcher: this.dispatcher, parent: this};
			// 	this.contentView = new window[this.options.toolbarItem.view](options);
			// 	this.parent.addView(this.contentView, '#toolbar-content');
			// }
			
			// content tab is closed.  assign active view and open
			if (this.parent.isContentOpen === false) {
				// the toolbar should know who the active view is
				this.parent.activeContentView = this.options.toolbarItem.view;
				// hide all the views besides this one
					var children = this.parent.$el.find('#toolbar-content').children().not('#' + this.contentView.id);
					_.each(children, function(otherView) {
						$(otherView).hide();
					}, this);
					this.contentView.$el.show();
				// animate the opening of the toolbar
				this.parent.contentOpen();
			}
			// content tab is open already
			else {
				// if active view is this one, close the panel
				if (this.parent.activeContentView == this.options.toolbarItem.view) {
					// closing the toolbar, so clear the active view
					this.parent.activeContentView = null;
					// animate the closing of the toolbar
					this.parent.contentClose();
				}
				// if this isn't the active view, assign active view and switch
				else {
					// the toolbar should know this is now the active view
					this.parent.activeContentView = this.options.toolbarItem.view;
					// hide all the views besides this one
					var children = this.parent.$el.find('#toolbar-content').children().not('#' + this.contentView.id);
					_.each(children, function(otherView) {
						$(otherView).hide();
					}, this);
					this.contentView.$el.show();
					// animate the switch
					this.parent.contentOpen();
				}
			}
		}
	});
});