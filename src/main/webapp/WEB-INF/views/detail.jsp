<%@ page pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/taglibs.jspf" %>

<t:layout noContainer="true" title="${room.name}">
	<jsp:attribute name="head">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/dist/detail.css">
	</jsp:attribute>
	<jsp:attribute name="scripts">
		<script>
			window.eventsJson = JSON.parse('${eventsJson}');

		</script>
		<script src="${pageContext.request.contextPath}/dist/detail.js"></script>
	</jsp:attribute>
	<jsp:body>
		<div class="bg-dark">
			<img class="img-fluid mx-auto d-block" src="${room.coverImageSrc}" alt="">
		</div>
		<div class="p-4 bg-dark">
			<h1 class="text-uppercase text-center text-warning font-weight-bold">${room.name}</h1>
		</div>
		<div class="p-4 bg-warning">
			<div class="container justify-content-center d-flex">
				<ul class="mb-0">
					<li>${room.hourlyPrice} €/h</li>
					<li><spring:message code="maxPersons" arguments="${room.capacity}"/></li>
				</ul>
					${room.description}
			</div>
		</div>
		<div class="container">
			<form:form action="${pageContext.request.contextPath}/rooms/${room.id}"
			           id="reservationForm"
			           method="POST" modelAttribute="reservation">
				<form:hidden path="room" value="${room.id}"/>
				<form:hidden path="user" value="${user.id}"/>
				<div class="row">
					<form:errors cssClass="alert alert-danger m-3 col"/>
				</div>
				<div class="row">
					<div class="col-md-8 mt-4">
						<div id="calendar" style="min-height: 680px"></div>
					</div>
					<div class="col-md-4 mt-4">
						<security:authorize access="isAuthenticated()">

							<div class="form-group">
								<form:label path="date"><spring:message code="reservation.date"/></form:label>
								<form:input class="form-control"
								            type="date"
								            path="date"
								            required="true"
								            cssErrorClass="form-control is-invalid"/>
								<form:errors path="date" cssClass="invalid-feedback"/>
							</div>

							<div class="form-row">
								<div class="form-group col">
									<form:label path="startTime"><spring:message
										code="reservation.startTime"/></form:label>
									<form:input class="form-control"
									            type="time"
									            path="startTime"
									            required="true"
									            cssErrorClass="form-control is-invalid"/>
									<form:errors path="startTime" cssClass="invalid-feedback"/>
								</div>

								<div class="form-group col">
									<form:label path="endTime"><spring:message code="reservation.endTime"/></form:label>
									<form:input class="form-control"
									            type="time"
									            path="endTime"
									            required="true"
									            cssErrorClass="form-control is-invalid"/>
									<form:errors path="endTime" cssClass="invalid-feedback"/>
									<small class="form-text text-muted">
										<spring:message code="reservation.duration"/>: <span id="duration"></span>
									</small>
								</div>
							</div>
							<div class="form-row">
								<div class="form-group col-md-4">
									<form:label path="personCount"><spring:message
										code="reservation.personCount"/></form:label>
									<form:input class="form-control"
												path="personCount"
												type="number"
												name="count"
												min="0"
												max="${room.capacity}"
												required="true"
												cssErrorClass="form-control is-invalid"/>
									<form:errors path="personCount" cssClass="invalid-feedback"/>
								</div>
							</div>

							<fieldset class="form-group">
								<legend><spring:message code="reservation.additionalServices"/></legend>
								<c:forEach items="${room.allowedAdditionalServices}" var="additionalService">
									<div class="form-check">
										<label class="form-check-label">
											<input type="checkbox"
											       name="additionalServices"
											       class="form-check-input"
											       value="${additionalService.id}">
											<spring:message code="additionalService.name.${additionalService.name}"/>
											(${additionalService.price} €)
										</label>
									</div>
								</c:forEach>
							</fieldset>

							<div class="form-group">
								<form:label path="notes"><spring:message
									code="reservation.notes"/></form:label>
								<form:textarea class="form-control"
								               path="notes"
								               cssErrorClass="form-control is-invalid"/>
								<form:errors path="notes" cssClass="invalid-feedback"/>
							</div>

							<p><spring:message code="reservation.totalPrice"/>: <span id="price"
							                                                          class="font-weight-bold">-</span>
							</p>

							<button type="submit" id="checkoutButton" class="btn btn-primary" disabled>
								<spring:message code="toCheckout"/>
							</button>
						</security:authorize>
						<security:authorize access="isAnonymous()">
							<div class="alert alert-info" role="alert">Sinun täytyy kirjautua sisään tehdäksesi
								varauksia
							</div>
						</security:authorize>
					</div>
				</div>
			</form:form>
		</div>
	</jsp:body>
</t:layout>