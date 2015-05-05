(function($){
	
	$.fn.validate = function(settings){
		var $that = $(this);

		var validate = function($input, pattern) {
			if(typeof pattern === 'string' || pattern instanceof String) {
				if(pattern === "zip" && /^\d{2}-\d{3}$/.test($input.val())) {
					console.log('do smth');
					return true;
				}
				if(pattern === "email" && /\S+@\S+\.\S+/.test($input.val())) {
					return true;
				}
			} else if(pattern instanceof RegExp) {
				if(pattern.test($input.val())) {
					return true;
				}
			}
			return false;
		}

		$.each(settings, function(input, value) {
			var $input = $that.children(input);
			$input.on('input', function() {
				if(validate($input, value)) {
					$input.addClass('valid');
					$input.removeClass('invalid');
				} else {
					$input.addClass('invalid');
					$input.removeClass('valid');
				}
			});
		});
	}
	
})(jQuery);