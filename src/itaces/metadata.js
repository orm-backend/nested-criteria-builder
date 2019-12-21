$.extend(QueryBuilder, {
	metadataToQBuilderFilers: function(metadata, referenceId) {
		
		function toQBuilderFilter(meta) {
			var filter = {
					id: referenceId ? referenceId + '.' + meta.name : meta.aliasname,
					label: meta.title,
					popupUrl: '/admin/datatable/'+meta.classUrlName
			}
			
			if (referenceId && meta.name == 'id') {
				filter.type = 'primary';
				filter.input = 'select';
				
				return filter;
			}

			switch (meta.type) {
				case 'number':
					filter.type = 'integer';
					filter.input = 'number';
					break;
				case 'text':
				case 'textarea':
					filter.type = 'string';
					filter.input = 'text';
					break;
				case 'datetime':
					filter.type = 'date';
					filter.input = 'text';
					filter.plugin = 'datetimepicker';
					filter.plugin_config = {
						format: 'yyyy-mm-dd hh:ii',
						todayHighlight: true,
				        autoclose: true,
				        clearBtn: true
				    }
					break;
				case 'date':
					filter.type = 'date';
					filter.input = 'text';
					filter.plugin = 'datepicker';
					filter.plugin_config = {
						format: 'yyyy-mm-dd',
						todayHighlight: true,
				        autoclose: true,
				        clearBtn: true,
				        templates: {
				            leftArrow: '<i class="la la-angle-left"></i>',
				            rightArrow: '<i class="la la-angle-right"></i>'
				        }
				    }
					break;
				case 'time':
					filter.type = 'date';
					filter.input = 'text';
					filter.plugin = 'timepicker';
					filter.plugin_config = {
						defaultTime: '',
						minuteStep: 1,
				        showSeconds: true,
				        showMeridian: false,
				        snapToStep: true
				    }
					break;
				case 'checkbox':
					filter.type = 'boolean';
					filter.input = 'checkbox';
					break;
				case 'radio':
					filter.type = 'enum';
					filter.input = 'radio';
					filter.values = meta.options;
					break;
				case 'reference':
					filter.type = 'reference';
					filter.metedataUrl = '/admin/datatable/'+meta.refClassUrlName+'/metadata';
					break;
				case 'collection':
					filter.type = 'collection';
					filter.input = 'select';
					filter.metedataUrl = '/admin/datatable/'+meta.refClassUrlName+'/metadata';
					break;
			}
			
			return filter;
		}
		
		var filters = [];
		
		$.each( metadata, function( i, meta ) {
			filters.push( toQBuilderFilter(meta, parent) );
		});
		
		return filters;
	}

});
