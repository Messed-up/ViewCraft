var skip = 0;
var top = 5;
var first = 0;


sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
 
	return Controller.extend("com.vodafone.MyProject.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.vodafone.MyProject.view.Detail
		 */
		onInit: function () {
			// this.oModel = this.getOwnerComponent().getModel("productsModel");
			// this.loadProductData();
			this.setModel();
			// this.osf = this.getView().byId("Search");
		},

		setModel: function () {
			this.oProductModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.oProductModel, "oModel");

			this.excelData = [];

			this.oExcelModel = new sap.ui.model.json.JSONModel(); // for My Products Icontab bar
			this.getView().setModel(this.oExcelModel, "excelModel");
		},
		loadProductData: function (s, t) {
			var that = this;
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			this.oModel.read("/Products", {
				async: false,
				urlParameters: {
					"$top": 5,
					"$skip": s,
				},
				success: function (oData, oResponse) {
					busyDialog.close();
					// oModel.setSizeLimit(output.length);
					that.getView().getModel("oModel").setData(oData.results);
					that.getView().getModel("oModel").updateBindings();
				},
				error: function (error) {
					debugger;
					busyDialog.close();

				}
			});
		},
		onSortDialog: function (oEvent) {
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("com.vodafone.MyProject.fragments.sortProducts", this);
				this.getView().addDependent(this.oDialog);
				// this.oDialog.open();
			}
			this.oDialog.open();
			// this.getViewSettingsDialog("com.vodafone.MyProject.fragments.sortProducts")
			// .then(function (oViewSettingsDialog) {
			// 	oViewSettingsDialog.open();
			// });
		},
		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("productDetails"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},
		// onFilterDialog: function (oEvent) {
		// 	debugger;
		// 	if (!this.filterDialog) {
		// 		this.filterDialog = sap.ui.xmlfragment("com.vodafone.MyProject.fragments.FilterDialog", this);
		// 		this.getView().addDependent(this.filterDialog);
		// 		// this.oDialog.open();
		// 	}

		// 	this.filterDialog.open();
		// },
		onFilterDialog: function () {
			var that = this;
			this.FilterValue = new sap.ui.model.json.JSONModel();
			if (!that._Dialog_filter) {
				that._Dialog_filter = sap.ui.xmlfragment("com.vodafone.MyProject.fragments.DbFilter", that);
			}
			var mainModel = {
				"ProductID": [],
				"ProductName": [],
				"CategoryID": [],
				"UnitsInStock": []
			};
			var refData = that.oProductModel.getData();
			var N = refData.length;
			var prodID = new Set();
			var prodName = new Set();
			var catID = new Set();
			var stock = new Set();
			for (var i = 0; i < N; i++) {
				var pId = refData[i].ProductID;
				var pName = refData[i].ProductName;
				var cId = refData[i].CategoryID;
				var stk = refData[i].UnitsInStock;
				if (!prodID.has(pId)) {
					mainModel.ProductID.push({
						"ProductID": pId
					});
					prodID.add(pId);
				}
				if (!prodName.has(pName)) {
					mainModel.ProductName.push({
						"ProductName": pName
					});
					prodName.add(pName);
				}
				if (!catID.has(cId)) {
					mainModel.CategoryID.push({
						"CategoryID": cId
					});
					catID.add(cId);
				}
				if (!prodName.has(stk)) {
					mainModel.UnitsInStock.push({
						"UnitsInStock": stk
					});
					stock.add(stk);
				}
			}
			that.FilterValue.setData(mainModel);
			that.getView().setModel(that.FilterValue, "FilterValue");
			that.getView().addDependent(that._Dialog_filter);
			that._Dialog_filter.open();
		},
		handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId("productDetails"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];
			var N = mParams.filterItems.length;
			for (var i = 0; i < N; i++) {
				// var fieldKey = oEvent.getSource().mAggregations.filterItems[i].mProperties.key;
				var fieldKey = mParams.filterItems[0].mBindingInfos.key.binding.sPath;
				var fieldValue = mParams.filterItems[i].mProperties.key;
				var sOperator = sap.ui.model.FilterOperator.EQ;
				var oFilter = new sap.ui.model.Filter(fieldKey, sOperator, fieldValue);
				aFilters.push(oFilter);
			}

			// mParams.filterItems.forEach(function(oItem) {
			// 	debugger;
			// 	var aSplit = oItem.getKey(),
			// 		sPath = aSplit[0],
			// 		sOperator = "contains",
			// 		sValue = aSplit,
			// 		oFilter = new sap.ui.model.Filter(sPath, sOperator, sValue);
			// 	aFilters.push(oFilter);
			// });

			// apply filter settings
			oBinding.filter(aFilters);
			if (aFilters.length != 0) {
				this.getView().byId("isFilter").setVisible(true);
			}
			// update filter bar
			// this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			// this.byId("vsdFilterLabel").setText(mParams.filterString);
		},
		tableFirst: function () {
			this.loadProductData(first, top);
		},
		tablePrev: function () {
			if (skip != 0) {
				skip -= 5;
				this.loadProductData(skip, top);
			}
		},
		tableNext: function () {
			skip += 5;
			this.loadProductData(skip, top);
		},
		itemDetails: function (oEvent) {
			debugger;
			var selectedItem = this.getView().getModel("oModel").getData()[oEvent.getParameters("listItem").listItem.sId.split("-").pop()];
			if (this.productDialog) {
				this.productDialog = sap.ui.xmlfragment("com.vodafone.MyProject.fragments.productsDetails", this);
				this.getView().addDependent(this.productDialog);
				// this.oDialog.open();
			}

			this.productDialog.open();
		},
		onOk: function (oEvent) {
			this.productDialog.close();
		},
		onSuggest: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			var oTable = this.getView().byId("productDetails");
			this.oBinding = oTable.getBinding("items");
			var aFilters = [];
			if (sValue && sValue.length > 0) {
				aFilters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.EQ, sValue),
						new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, sValue),
						new sap.ui.model.Filter("CategoryID", sap.ui.model.FilterOperator.EQ, sValue),
						new sap.ui.model.Filter("UnitsInStock", sap.ui.model.FilterOperator.EQ, sValue)
					], false)
				];
			}

			this.oBinding.filter(aFilters);
			// this.oSF.suggest();
		},
		clearFilter: function (oEvent) {
			var oTable = this.getView().byId("productDetails");
			this.oBinding = oTable.getBinding("items");
			this.oBinding.filter([]);
			this.getView().byId("isFilter").setVisible(false);
		},
		onPressExcel: function () {
			var oTable = this.byId("productDetails");
			debugger;
		},

		// onUpload: function (evt) {
		// 	debugger;
		// 	var that = this;
		// 	var files = evt.getParameter("files"); // FileList object
		// 	var xl2json = this.ExcelToJSON();
		// 	xl2json.parseExcel(files[0]);
		// },
		// ExcelToJSON: function () {
		// 	this.parseExcel = function (file) {
		// 		var reader = new FileReader();
		// 		var parsedArray = [];

		// 		reader.onload = function (e) {
		// 			var data = e.target.result;
		// 			var workbook = XLSX.read(data, {
		// 				type: 'binary'
		// 			});
		// 			workbook.SheetNames.forEach(function (sheetName) {
		// 				// var	that = this;
		// 				// Here is your object
		// 				var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		// 				var json_object = JSON.stringify(XL_row_object);
		// 				console.log(JSON.parse(json_object));
		// 				jQuery('#xlx_json').val(json_object);
		// 				//arr = JSON.parse(json_object);
		// 				debugger;
		// 				parsedArray.push(JSON.parse(json_object));
		// 			})
		// 		};
		// 		return parsedArray;
		// 	}

		// 	reader.onerror = function (ex) {
		// 		console.log(ex);
		// 	};

		// 	reader.readAsBinaryString(file);
		// },

		onUploadTable: function (e) {
			if (!this.excelDialog) {
				this.excelDialog = sap.ui.xmlfragment("com.vodafone.MyProject.fragments.UploadExcel", this);
				this.getView().addDependent(this.excelDialog);
				// this.oDialog.open();
			}
			sap.ui.getCore().byId("oButtonAddColumns").setEnabled(false);
			sap.ui.getCore().byId("oButtonCancelColumns").setEnabled(false);
			sap.ui.getCore().byId("FileUploaderId").setEnabled(true);
			this.excelDialog.open();
		},

		onUpload: function (e) {
			this._import(e.getParameter("files") && e.getParameter("files")[0]);
		},
		_import: function (file) {
			debugger;
			var that = this;
			var excelData = {};
			if (file) {
				var reader = new FileReader();
				reader.onload = function (e) {
					debugger;
					var data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
					workbook.SheetNames.forEach(function (sheetName) {
						// Here is your object for every sheet in workbook
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
						// var json_object = JSON.stringify(excelData);

					});
					// Setting the data to the local model 
					that.oExcelModel.setData({
						items: excelData
					});
					that.oExcelModel.refresh(true);
				};
				reader.onerror = function (ex) {
					console.log(ex);
				};
				reader.readAsBinaryString(file);
			}
			sap.ui.getCore().byId("oButtonAddColumns").setEnabled(true);
			sap.ui.getCore().byId("oButtonCancelColumns").setEnabled(true);
			sap.ui.getCore().byId("FileUploaderId").setEnabled(false);

		},
		addColumns: function (that) {
			var oModel = this.getTableData(this);
			this.createDynTable(this, oModel);
			this.excelDialog.close();
		},
		getTableData: function (that) {
			debugger;
			var rowData = that.oExcelModel.oData.items;
			var totalData = rowData.length;
			var columns = Object.keys(rowData[0]);
			var columnData = [];
			for (var i = 0; i < columns.length; i++) {
				var name = columns[i];
				columnData.push({
					"colName": name,
					"colVisibility": true,
					"colPosition": i
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
			var oTable = this.byId("excelTable");
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
		
		cancelColumns: function(){
			this.excelDialog.close();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.vodafone.MyProject.view.Detail
		 */
		// onBeforeRendering: function() {
		// 	this.oModel = this.getOwnerComponent().getModel("productsModel");
		// this.loadProductData();
		// }

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.vodafone.MyProject.view.Detail
		 */
		onAfterRendering: function () {
			this.oModel = this.getOwnerComponent().getModel("productsModel");
			this.loadProductData(skip, top);
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.vodafone.MyProject.view.Detail
		 */
		//	onExit: function() {
		//
		//	}

	});

});