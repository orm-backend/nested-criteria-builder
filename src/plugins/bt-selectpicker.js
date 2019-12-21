/**
 * @class BtSelectpicker
 * @memberof module:plugins
 * @descriptioon Applies Bootstrap Select on filters and operators combo-boxes.
 * @param {object} [options]
 * @param {string} [options.container='body']
 * @param {string} [options.style='btn-inverse btn-xs']
 * @param {int|string} [options.width='auto']
 * @param {boolean} [options.showIcon=false]
 * @throws MissingLibraryError
 */
QueryBuilder.define('bt-selectpicker', function(options) {
    if (!$.fn.selectpicker || !$.fn.selectpicker.Constructor) {
        Utils.error('MissingLibrary', 'Bootstrap Select is required to use "selectpicker" plugin. Get it here: http://silviomoreto.github.io/bootstrap-select');
    }

    var Selectors = QueryBuilder.selectors;

    // init selectpicker
    this.on('afterCreateRuleFilters', function(e, rule) {
    	rule.$el.find(Selectors.filter_container).find('select').selectpicker(options);
    });

    this.on('afterCreateRuleOperators', function(e, rule) {
    	rule.$el.find(Selectors.operator_container).find('select').selectpicker(options);
    });
    
    this.on('afterCreateRuleInput', function(e, rule) {
    	rule.$el.find(Selectors.value_container).find('select').selectpicker(options);
    	
    	rule.$el.find(Selectors.value_container).find('button.show-datatable').on('click', function(e) {
    		var opener = $(this).parent().find('select').attr('name');
        	openPopupWindow($(this).data('url') + '?opener=' + opener);
        });
    });

    // update selectpicker on change
    this.on('afterUpdateRuleFilter', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).selectpicker('render');
    });

    this.on('afterUpdateRuleOperator', function(e, rule) {
        rule.$el.find(Selectors.rule_operator).selectpicker('render');
    });

    this.on('beforeDeleteRule', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).selectpicker('destroy');
        rule.$el.find(Selectors.rule_operator).selectpicker('destroy');
    });
}, {
    showIcon: false
});
