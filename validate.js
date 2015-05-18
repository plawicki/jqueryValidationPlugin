/* global jQuery */
(function($){
	
  "use strict";
  
	$.fn.validate = function(settings, styles){
		var standartSettings = {
			styles:{
				valid : 'valid',
				invalid: 'invalid',
				password: 'password'
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
				email: /\S+@\S+\.\S+/
			},
			entropy: 61
		};
		var $that = $(this);
		
		$.each(settings, function(input, value) {
			var $input = $that.children(input);
			$input.on('input', function() {
				validateCore($input, value);
			});
		});

		var validateCore = function($input, pattern) {
			switch(pattern.constructor) {
				case String: 
					validateStrings($input, pattern);
					break;
				case RegExp:
					validateByRegexp($input, pattern);
					break;
				case Object: 
					validateZipAutocomplete($input, pattern);
					break;
			}
		};

		var validateStrings = function($input, pattern) {
			switch(pattern) {
				case "zip":
					validateZip($input);
					break;
				case "email":
					validateEmail($input);
					break;
				case "password":
					validatePassword($input);
					break;
			}
		};
		
		var validateZip = function($input) {
			paintField(standartSettings.patterns.zip.test($input, $input.val()));
		};
		
		var validatePassword = function($input) {
			var passwordStr = countStrength($input.val());
			paintField($input, isPasswordStrong(passwordStr));
		};
		
		var countStrength = function(password) {
			var entropy = 0,
        	letters = 26,
        	digits = 10,
        	specials = 32,
        	length = password.toString().length;

        	for(var c=0; c<length; c++) {

        		var character = password.toString().charAt(c);

	        	switch(true) {
	            	case /[A-z]/.test(character):
	                	entropy += letters;
	                	break;
	            	case /[0-9]/.test(character):
	                	entropy += digits;
	                	break;
	            	case /[\W]/.test(character):
	                	entropy += specials;
	                	break;
	       		}
        	}
        	entropy = Math.log2(entropy);

        	return entropy *= length;
		};
		
		var isPasswordStrong = function(value) {
			return (value >= standartSettings.entropy) ? true : false;
		};

		var validateEmail = function($input) {
			paintField($input, standartSettings.patterns.email.test($input.val()));
		};
		
		var validateByRegexp = function($input, pattern) {
			paintField($input, pattern.test($input.value));
		};
		
		var validateZipAutocomplete = function($input, pattern) {
			var $autoAdressDiv = $input.parent().children(pattern.wrapper.selector || standartSettings.selectors.address);
					
			$.ajax({
				url: pattern.url,
				dataType: "json"
			}).done(function(json) {
				var zip = json[$input.val()];

				if(paintField($input, zip)) {
					$.each(pattern.wrapper, function(key, val){
						$($autoAdressDiv).children(val.selector || standartSettings.selectors.street).val(
							zip[val.jsonField || val]
						);
					});
				}
			});
		};
		
		var paintField = function($input, correct) {
			var classs = correct ? (styles && styles.valid || standartSettings.styles.valid) : (styles && styles.invalid || standartSettings.styles.invalid);

			$input.removeClass(styles && styles.valid || standartSettings.styles.valid)
				.removeClass(styles && styles.invalid || standartSettings.styles.invalid)
				.addClass(classs);

			return correct;
		};

		return this;
	};
	
})(jQuery);
