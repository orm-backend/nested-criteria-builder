
QueryBuilder.define('native-select', function() {
	var Selectors = QueryBuilder.selectors;
	
    this.on('afterCreateRuleInput', function(e, rule) {
    	rule.$el.find(Selectors.value_container).find('select');
    	
    	rule.$el.find(Selectors.value_container).find('button.show-datatable').on('click', function(e) {
    		var opener = $(this).parent().find('select').attr('name');
        	openPopupWindow($(this).data('url') + '?opener=' + opener);
        });
    });

});
