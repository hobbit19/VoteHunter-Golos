<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>YouSource</title>
	<base href="/">

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/x-icon" href="favicon.ico">
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
