QueryBuilder.prototype.toItAces = function(filters) {

	function switchOperator(operator) {
		switch(operator) {
			case 'equal':
				return 'eq';
			case 'not_equal':
				return 'neq';
			case 'in':
				return 'in';
			case 'not_in':
				return 'notIn';
			case 'less':
				return 'lt';
			case 'less_or_equal':
				return 'lte';
			case 'greater':
				return 'gt';
			case 'greater_or_equal':
				return 'gte';
			case 'between':
				return 'between';
			case 'not_between':
				return 'notBetween';
			case 'begins_with':
				return 'begins';
			case 'not_begins_with':
				return 'notBegins';
			case 'like':
				return 'like';
			case 'not_like':
				return 'notLike';
			case 'contains':
				return 'contains';
			case 'not_contains':
				return 'noContains';
			case 'ends_with':
				return 'ends';
			case 'not_ends_with':
				return 'notEnds';
			case 'is_empty':
				return 'empty';
			case 'is_not_empty':
				return 'notEmpty'
			case 'is_null':
				return 'isNull';
			case 'is_not_null':
				return 'isNotNull'
		}
		
		return null;
	}

	function convertGroup(group) {
		var result = [];
		
		if (group.condition === 'OR') {
			result.push('or');
		}

		group.rules.forEach(function(rule) {
			if (Array.isArray(rule.rules)) {
				result.push(convertGroup(rule));
			} else {
				var criteria = [rule.id, switchOperator(rule.operator)];
				
				if (rule.operator === 'between' || rule.operator === 'not_between') {
					criteria.push(rule.value[0], rule.value[1]);
				} else if (rule.operator === 'in' || rule.operator === 'not_in') {
					if (!Array.isArray(rule.value)) {
						criteria.push([rule.value]);
					} else {
						criteria.push(rule.value);
					}
				} else if (rule.operator !== 'is_null' && rule.operator !== 'is_not_null' &&
						rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty') {
					criteria.push(rule.value);
				}
				
				result.push(criteria);
			}
		});
		
		return result;
	}

	return convertGroup(filters);
};

QueryBuilder.prototype.toQBuilder = function(filters) {

	function switchOperator(operator) {
		switch(operator) {
			case 'eq':
				return 'equal';
			case 'neq':
				return 'not_equal';
			case 'in':
				return 'in';
			case 'notIn':
				return 'not_in';
			case 'lt':
				return 'less';
			case 'lte':
				return 'less_or_equal';
			case 'gt':
				return 'greater';
			case 'gte':
				return 'greater_or_equal';
			case 'between':
				return 'between';
			case 'notBetween':
				return 'not_between';
			case 'begins':
				return 'begins_with';
			case 'notBegins':
				return 'not_begins_with';
			case 'like':
				return 'like';
			case 'notLike':
				return 'not_like';
			case 'contains':
				return 'contains';
			case 'notContains':
				return 'not_contains';
			case 'ends':
				return 'ends_with';
			case 'notEnds':
				return 'not_ends_with';
			case 'empty':
				return 'is_empty';
			case 'notEmpty':
				return 'is_not_empty'
			case 'isNull':
				return 'is_null';
			case 'isNotNull':
				return 'is_not_null';
		}
		
		return null;
	}
	
	function convertCriteria(criteria) {
		if (Array.isArray(criteria[0]) || criteria[0] === 'or' || criteria[0] === 'and') {
			return convertGroup(criteria);
		}
		
		var operator = switchOperator(criteria[1]);
		var rule = {
			id: criteria[0],
			operator: operator
		};
		
		if (operator === 'between' || operator === 'not_between') {
			rule.value = [criteria[2], criteria[3]];
			criteria.push(rule.value[0], rule.value[1]);
		} else if (rule.operator !== 'is_null' && rule.operator !== 'is_not_null' &&
				rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty') {
			rule.value = criteria[2];
		} else {
			rule.value = null;
		}
		
		return rule;
	}
	
	function convertGroup(rules) {
		var operand = 'AND';
		
		if (rules[0] === 'or' || rules[0] === 'and') {
			if (rules[0] === 'or') {
				operand = 'OR';
			}
			
			rules.shift();
		}
		
		var group = {
				condition: operand,
				rules: []
		};

		rules.forEach(function(criteria) {
			group.rules.push(convertCriteria(criteria));
		});

		return group;
	}

	return convertGroup(filters);
};
