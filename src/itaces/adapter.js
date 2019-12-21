
QueryBuilder.prototype.fetchMetadata = function(metedataUrl, reference) {
	var self = this;
	
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: metedataUrl,
			type:"GET",
			dataType: "json",
			beforeSend: function( xhr ) {
				//
			},
			success: function(metadata) {
				var filters = QueryBuilder.metadataToQBuilderFilers(metadata, reference);
				resolve(filters);
			},
			error: function( xhr, status, error ) {
				reject(status);
			}
		});
	});
};

QueryBuilder.prototype.fromJson = function(data) {
	var self = this, references = [];
	
	function feelReferences(rules) {
		rules.forEach(function(rule) {
			if (Array.isArray(rule.rules)) {
				feelReferences(rule.rules);
			} else {
				const pieces = rule.id.split('.');
				
				if (pieces.length > 2) {
					var referenceId = pieces[0];
	
					for (var i = 1; i < pieces.length - 1; i ++) {
						referenceId += '.' + pieces[i];
						var item = {
								level: i,
								referenceId: referenceId
						}
						
						references.push(item);
					}
				}
			}
		});
	}
	
	feelReferences(data.rules);
	var unique = [];
	var map = {};
	
	for (const item of references) {
	    if (map[item.referenceId] === undefined) {
	        unique.push({
	        	referenceId: item.referenceId,
	            level: item.level
	        });
	        
	        map[item.referenceId] = true;
	    }
	}
	
	unique.sort((a,b) => (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0));

	unique.reduce(function(p, item) {
	    return p.then(function() {
	    	var reference = self.getFilterById(item.referenceId);
	    	const metedataUrl = reference.metedataUrl;
	    	
	        return self.fetchMetadata(metedataUrl, item.referenceId).then((filters) => {
	        	filters.forEach(function(filter) {
	        		if (self.nestedMap[item.referenceId] === undefined) {
	        			self.nestedMap[item.referenceId] = [];
	        		}
	        		
	        		self.nestedMap[item.referenceId].push(filter);
	        	});
	        });
	    });
	}, Promise.resolve()).then(function() {
		self.setRules(data, {allow_invalid: true});
	}).catch(function(err) {
		console.log(err);
	});

};

QueryBuilder.prototype.fromUrl = function() {
	var query = window.location.search ? window.location.search.substr(1) : '';
	
	if (query) {
		var params = $.deparam(query);
		
		if (params['filter'] !== undefined) {
			var data = this.toQBuilder(params['filter']);
			this.fromJson(data);
		}
	}
};

QueryBuilder.prototype.renderNestedFilterSelect = function(rule, ruleFielters) {
	var $container = rule.$el.find(QueryBuilder.selectors.filter_container);
	var $filterSelect = $(this.getRuleFilterSelect(rule, ruleFielters));
	$filterSelect.attr('data-level', $container.find('select').length + 1);
	$container.append($filterSelect);
};

QueryBuilder.prototype.removeNestedFilterSelect = function(rule, $current) {
	var bootstrap = $current.parent().hasClass('bootstrap-select');
	var native = !$current.next(':not(select)').length;

	if (native) {
		$current.nextAll().remove();
	} else if (bootstrap) {
		$current.parent().nextAll().remove();
	} else {
		$current.next().nextAll().remove(); // select2
	}
};

QueryBuilder.prototype.getNestedMap = function() {
	return this.nestedMap;
};

QueryBuilder.prototype.setNestedMap = function(nestedMap) {
	this.nestedMap = nestedMap;
};
