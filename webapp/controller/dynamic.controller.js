sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.vodafone.MyProject.controller.dynamic", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.vodafone.MyProject.view.dynamic
		 */
		onInit: function () {
			this.setModel(); // call the set model function
		},

		setModel: function () {
			this.oDynamicdata = [];
			// this.getView().setModel(this.oDynamicdata, "oModel");
		},

		onBeforeRendering: function () {
			this.oModel = this.getOwnerComponent().getModel("productsModel");
			this.loadProductData();
		},

		loadProductData: function () {
			var that = this;
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			this.oModel.read("/Regions", {
				async: true,
				success: function (oData, oResponse) {
					busyDialog.close();
					// oModel.setSizeLimit(output.length);
					// that.getView().getModel("oModel").setData(oData.results);
					for (var i = 0; i < oData.results.length; i++) {
						that.oDynamicdata.push(oData.results[i]);
					}
					// that.getView().getModel("oModel").updateBindings();
				},
				error: function (error) {
					debugger;
					busyDialog.close();

				}
			});
		},
		addColumns: function (that) {
			var oModel = this.getTableData(this);
			this.createDynTable(this, oModel);
		},
		getTableData: function (that) {
			// var rowData = this.oModel.getData();
			// var rowData = [{
			// 	"Amount": "200",
			// 	"Quantity": "RF",
			// 	"Unit": "CV",
			// 	"OpenPOAmount": "5988",
			// 	"OpenPOQuantity": "YY",
			// 	"EXT_FLDS": {
			// 		"PRINTING_NUM": {
			// 			"fieldvalue": 10,
			// 			"fieldlabel": "Printing Number",
			// 			"uictrl": "sap.m.Input"
			// 		},
			// 		"COUNTRY": {
			// 			"fieldvalue": "Thailand",
			// 			"fieldlabel": "Country",
			// 			"uictrl": "sap.m.ComboBox"
			// 		}
			// 	}
			// }, {
			// 	"Amount": "80",
			// 	"Quantity": "UG",
			// 	"Unit": "RT",
			// 	"OpenPOAmount": "878",
			// 	"OpenPOQuantity": "RF",
			// 	"EXT_FLDS": {
			// 		"PRINTING_NUM": {
			// 			"fieldvalue": 11,
			// 			"fieldlabel": "Printing Number",
			// 			"uictrl": "sap.m.Input"
			// 		},
			// 		"COUNTRY": {
			// 			"fieldvalue": "Thailand",
			// 			"fieldlabel": "Country",
			// 			"uictrl": "sap.m.ComboBox"
			// 		}
			// 	}
			// }, {
			// 	"Amount": "789",
			// 	"Quantity": "GV",
			// 	"Unit": "ED",
			// 	"OpenPOAmount": "8989",
			// 	"OpenPOQuantity": "FGG",
			// 	"EXT_FLDS": {
			// 		"PRINTING_NUM": {
			// 			"fieldvalue": 12,
			// 			"fieldlabel": "Printing Number",
			// 			"uictrl": "sap.m.Input"
			// 		},
			// 		"COUNTRY": {
			// 			"fieldvalue": "Thailand",
			// 			"fieldlabel": "Country",
			// 			"uictrl": "sap.m.ComboBox"
			// 		}
			// 	}
			// }];
			var rowData = that.oDynamicdata;
			var totalData = rowData.length;
			var columns = Object.keys(rowData[0]);
			var columnData = [];
			for (var i = 1; i < columns.length; i++) {
				var name = columns[i];
				columnData.push({
					"colName": name,
					"colVisibility": true,
					"colPosition": i + 1
				});
			}

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				rows: rowData,
				columns: columnData
			});
			debugger;
			return oModel;
		},
		/**
		 *  Creating Dynamic table
		 */
		createDynTable: function (that, oModel) {
			debugger;
			var oTable = this.byId("reOrderTable");
			oTable.setModel(oModel);
			oTable.bindColumns("/columns", function (sId, oContext) {
				var columnName = oContext.getObject().colName;
				return new sap.ui.table.Column({
					label: columnName,
					template: columnName,
				});
			});
			oTable.bindRows("/rows");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.vodafone.MyProject.view.dynamic
		 */

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.vodafone.MyProject.view.dynamic
		 */
		// onAfterRendering: function() {
		// 	debugger;
		// 	var oTableModel = this.getTableData(this);
		// 	this.createDynTable(this, oModel);
		// }

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.vodafone.MyProject.view.dynamic
		 */
		//	onExit: function() {
		//
		//	}

	});

});