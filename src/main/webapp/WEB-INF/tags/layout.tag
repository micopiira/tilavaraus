<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ tag description="Layout" pageEncoding="UTF-8" %>
<%@ attribute name="head" fragment="true" %>
<%@ attribute name="scripts" fragment="true" %>
<%@ attribute name="title" %>
<%@ attribute name="noContainer" type="java.lang.Boolean" %>

<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport"
	      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta name="theme-color" content="#fbba18">
	<link rel="shortcut icon" type="image/x-icon" href="${pageContext.request.contextPath}/favicon.ico"/>
	<link rel="manifest" href="${pageContext.request.contextPath}/manifest.json">
	<title><spring:message code="${empty title ? 'title' : title}" text="${title}"/></title>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/dist/main.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/outdatedbrowser.css">
	<jsp:invoke fragment="head"/>
</head>
<body>
<!--[if IE]>
<div class="alert alert-danger mb-0">
	<strong>Huomio</strong> Käytät vanhentunutta selainta! Sivusto ei todennäköisesti toimi käyttämälläsi selaimella.
	<a href="http://whatbrowser.org/" class="text-info" target="_blank">Päivitä selaimesi</a>
</div>
<![endif]-->
<jsp:include page="/WEB-INF/views/_header.jsp"/>
<div class="${noContainer ? '' : 'container'}">
	<jsp:doBody/>
</div>
<div id="outdated">
	<h6>Your browser is out-of-date!</h6>
	<p>Update your browser to view this website correctly. <a id="btnUpdateBrowser" href="http://outdatedbrowser.com/">Update
		my browser now </a></p>
	<p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p>
</div>
<script src="${pageContext.request.contextPath}/outdatedbrowser.js"></script>
<script>
	function addLoadEvent(func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function () {
				if (oldonload) {
					oldonload();
				}
				func();
			}
		}
	}

	addLoadEvent(function () {
		outdatedBrowser({
			bgColor: '#f25648',
			color: '#ffffff',
			lowerThan: 'Edge',
			languagePath: './lang/${pageContext.response.locale.language}.html'
		})
	});
</script>
<script src="${pageContext.request.contextPath}/dist/main.js"></script>
<jsp:invoke fragment="scripts"/>
</body>
</html>