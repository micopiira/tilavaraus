<%@ tag description="Layout" pageEncoding="UTF-8" %>
<%@ attribute name="head" fragment="true" %>
<%@ attribute name="footer" fragment="true" %>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport"
	      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta name="theme-color" content="#fbba18">
	<link rel="manifest" href="${pageContext.request.contextPath}/manifest.json">
	<title>Document</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css"
	      integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
	<jsp:invoke fragment="head"/>
</head>
<body>
<jsp:include page="/WEB-INF/views/_header.jsp"/>
<div class="container">
	<jsp:doBody/>
</div>
<jsp:invoke fragment="footer"/>
<script>
	if ('serviceWorker' in navigator) {
		console.log("Will the service worker register?");
		navigator.serviceWorker.register('service-worker.js')
			.then(function (reg) {
				console.log("Yes, it did.");
			}).catch(function (err) {
			console.log("No it didn't. This happened: ", err)
		});
	}
</script>
</body>
</html>