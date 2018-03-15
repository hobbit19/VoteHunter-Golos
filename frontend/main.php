<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>YouSource</title>
	<base href="/">

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
    <link rel="manifest" href="/icons/site.webmanifest">
    <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
</head>
<body>
<vh-root class="root"></vh-root>
<?php
if (!empty(Yii::$app->params['isDevelopment'])) {
    echo "<script type=\"text/javascript\" src=\"inline.bundle.js\"></script>
		<script type=\"text/javascript\" src=\"polyfills.bundle.js\"></script>
		<script type=\"text/javascript\" src=\"styles.bundle.js\"></script>
		<script type=\"text/javascript\" src=\"vendor.bundle.js\"></script>
		<script type=\"text/javascript\" src=\"main.bundle.js\"></script>";
}
?>
</body>
</html>
