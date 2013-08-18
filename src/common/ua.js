(function() {

	function numberify(s) {
		var c = 0;

		return parseFloat(s.replace(/\./g, function() {
			return c++ === 0 ? '.' : '';
		}))
		
	}

	var UA = $.UA || (function() {

		var browser = $.browser,
			versionNumber = numberify(browser.version),

			ua = {

				ie: browser.msie && versionNumber,

				webkit: browser.webkit && versionNumber,

				opera: browser.opera && versionNumber,

				mozilla: browser.mozilla && versionNumber
			}

		return ua;
	})()

	
})()