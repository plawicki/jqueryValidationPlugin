(function($){
	
	$.fn.validate = function(settings, styles){
		var standartSettings = {
			styles:{
				valid : 'valid',
				invalid: 'invalid'
			},
			selectors:{
				name: '#name',
				email: '#email',
				login: '#login',
				password: '#password',
				zip: '#zip',
				address: '#address',
				street: '#street',
				city: '#city',
				firstAdm: '#firstAdm',
				secondAdm: '#secondAdm'
			},
			patterns:{
				zip: /^\d{2}-\d{3}$/g,
				email: /\S+@\S+\.\S+/g
			}
		}
		var $that = $(this);

		var validate = function($input, pattern) {
			var iValue = $input.val();
			if(typeof pattern === 'string' || pattern instanceof String) {
				if(pattern === "zip" && standartSettings.patterns.zip.test(iValue)) {
					return true;
				}
				if(pattern === "email" && standartSettings.patterns.email.test(iValue)) {
					return true;
				}
			} else if(pattern instanceof RegExp) {
				if(pattern.test(iValue)) {
					return true;
				}
			} else if(pattern instanceof Object) {
				if(standartSettings.patterns.zip.test(iValue)) {

					if(!pattern.url) {
						console.error("Cannot find url field in zip object")
						return true;
					}

					var $autoAdressDiv = $input.parent().children(pattern.address || standartSettings.selectors.address);
					
					$.ajax({
						url: pattern.url,
						done: function(){
							console.log("ASDASD");
						},
						fail: function(){
							$("body").css("background", "black");
						},
						always: function(){
							$("body").append("<img></img>");
							console.log($autoAdressDiv);
						}
					})

					return true;
				}
			}
			return false;
		}

		$.each(settings, function(input, value) {
			var $input = $that.children(input);
			$input.on('input', function() {
				if(validate($input, value)) {
					$input.addClass(styles && styles.valid ? styles.valid : standartSettings.styles.valid);
					$input.removeClass(styles && styles.invalid ? styles.invalid : standartSettings.styles.invalid);
				} else {
					$input.addClass(styles && styles.invalid ? styles.invalid : standartSettings.styles.invalid);
					$input.removeClass(styles && styles.valid ? styles.valid : standartSettings.styles.valid);
				}
			});
		});
	}
	
})(jQuery);