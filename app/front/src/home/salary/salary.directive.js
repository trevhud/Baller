angular.module('home')

	.directive('Home.SalaryDirective', function() {
		
		return {
			template: 'Weekly: {{rates.weekly}} Monthly: {{rates.monthly}} Annual: {{rates.annual}}'

		};

	});