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
			}
		};
		var $that = $(this);

		var paintField = function($input, correct) {
			var classs = correct ? (styles && styles.valid || standartSettings.styles.valid) : (styles && styles.invalid || standartSettings.styles.invalid);

			$input.removeClass(styles && styles.valid || standartSettings.styles.valid)
				.removeClass(styles && styles.invalid || standartSettings.styles.invalid)
				.addClass(classs);

			return correct;
		};

		var validateZip = function($input) {
			paintField(standartSettings.patterns.zip.test($input, $input.val()));
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

		var isPasswordStrong = function(value) {
			return (value > 1.7) ? true : false;
		};

		var countStrength = function(password) {
			var strength = 0;
			var weightSmall = 1, weightBig = 2, weightSpecial = 3;

			for(var c=0; c<password.length; c++) {
				var character = password.charCodeAt(c);
				if(character > 96 && character < 123) {
					strength += weightSmall;
				} else if (character > 64 && character < 91) {
					strength += weightBig;
				} else {
					strength += weightSpecial;
				}
			}

			return strength / password.length;
		};

		var validatePassword = function($input) {
			var passwordStr = countStrength($input.val());

			paintField($input, isPasswordStrong(passwordStr));
		};

		var validateEmail = function($input) {
			console.log(standartSettings.patterns.email.test($input.val()))
			paintField($input, standartSettings.patterns.email.test($input.val()));
		};

		var validateByRegexp = function($input, pattern) {
			paintField($input, pattern.test($input.value));
		};

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

		$.each(settings, function(input, value) {
			var $input = $that.children(input);
			$input.on('input', function() {
				validateCore($input, value);
			});
		});

		return this;
	};
	
})(jQuery);