sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.vodafone.MyProject.controller.Base", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home", null, true);
		},
		
		icontab: function (evt) {
			var key = evt.getParameters().selectedKey;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			switch (key) {
			case "dashboard":
				oRouter.navTo("Home", null, true);
				break;
			case "products":
				oRouter.navTo("Detail", null, true);
				break;
			case "dynamic":
				oRouter.navTo("Dynamic", null, true);
				break;
			default:
				oRouter.navTo("Home", null, true);
			}

		}

	});
});