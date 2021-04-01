<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title ng-bind="$root.aprilMode ? 'Snuttisfactory Tools' : 'Satisfactory Tools'">Satisfactory Tools</title>

	<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/favicon-16x16.png">
	<link rel="manifest" href="/assets/images/icons/site.webmanifest">
	<link rel="mask-icon" href="/assets/images/icons/safari-pinned-tab.svg" color="#da532c">
	<link rel="shortcut icon" href="/assets/images/icons/favicon.ico">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="msapplication-config" content="/assets/images/icons/browserconfig.xml">
	<!-- Primary Meta Tags -->
	<meta name="theme-color" content="#df691a">
	<meta name="title" content="Satisfactory Tools" />
	<meta name="type" content="website" />
	<meta name="image" content="https://www.satisfactorytools.com/assets/images/icons/android-chrome-512x512.png" />
	<meta name="description" content="A collection of powerful tools for planning and building the perfect base. Calculate your production or consumption, browse items, buildings, and schematics and share your builds with others!" />
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://www.satisfactorytools.com/">
	<meta property="og:title" content="Satisfactory Tools">
	<meta property="og:description" content="A collection of powerful tools for planning and building the perfect base. Calculate your production or consumption, browse items, buildings, and schematics and share your builds with others!">
	<meta property="og:image" content="https://www.satisfactorytools.com/assets/images/icons/android-chrome-512x512.png">
	<!-- Twitter -->
	<meta property="twitter:card" content="summary">
	<meta property="twitter:url" content="https://www.satisfactorytools.com/">
	<meta property="twitter:title" content="Satisfactory Tools">
	<meta property="twitter:description" content="A collection of powerful tools for planning and building the perfect base. Calculate your production or consumption, browse items, buildings, and schematics and share your builds with others!">
	<meta property="twitter:image" content="https://www.satisfactorytools.com/assets/images/icons/android-chrome-512x512.png">

	<style>
		[ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
			display: none !important;
		}

		/* for faster loading */
		body {
			margin: 0;
			font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
			font-size: 1rem;
			font-weight: 400;
			line-height: 1.5;
			color: #EBEBEB;
			text-align: left;
			background-color: #2B3E50;
		}

		.fullscreen-loader {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			background-color: #2B3E50;

			align-items: center;
			justify-content: center;
			flex-direction: column;
			z-index: 10000;
		}

		@keyframes loading {
			0% {
				opacity: 1;
				font-size: 1em;
			}
			99% {
				opacity: 0;
				font-size: 30em;
			}
			100% {
				z-index: -10;
				opacity: 0;
				font-size: 20em;
			}
		}

		.fullscreen-loader.hidden {
			animation: loading 0.7s ease-in-out;
			animation-fill-mode: forwards;
		}

		.fullscreen-loader .logo {
			margin-bottom: 20px;
		}

		.fullscreen-loader .loader {
			font-size: 50px;
		}

		.fullscreen-loader .loader-text, .fullscreen-loader .loader-text span {
			margin-top: 20px;
			font-size: 32px;
		}
	</style>
	<link rel="stylesheet" href="/assets/css/fontawesome.min.css">
	<base href="/" ng-class="{'april-mode': $root.aprilMode}">
</head>
<body>

<div id="toasts" class="toasts"></div>

<app></app>

<div class="fullscreen-loader" ng-class="{hidden: true}">
	<div class="logo">
		<img src="/assets/images/logo/satisfactorySmall.png" height="60">
		<img src="/assets/images/logo/tools.png" height="60">
	</div>
	<div>
		<span class="loader fas fa-spin fa-sync-alt"></span>
	</div>
	<div class="loader-text">
		<span ng-bind="'Entering'">Loading</span> the A.W.E.S.O.M.E.!
	</div>
</div>

<script src="/assets/app.js?v=<?= filemtime(__DIR__ . '/assets/app.js') ?>" async></script>
<script type="text/javascript">
	var _paq = window._paq || [];
	_paq.push(["setDoNotTrack", true]);
	_paq.push(['trackPageView']);
	_paq.push(['enableLinkTracking']);
	(function() {
		var u="//analytics.greeny.dev/";
		_paq.push(['setTrackerUrl', u+'matomo.php']);
		_paq.push(['setSiteId', '4']);
		var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
		g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
	})();
</script>
</body>
</html>
