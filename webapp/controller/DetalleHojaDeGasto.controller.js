sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.moduloDeHojasDeGasto.controller.DetalleHojaDeGasto", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5fb061606345bf1229eecce9";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			if (!this.sContext) {
				this.sContext = "HojasDeGastoSet('66945')";
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onButtonPress: function () {
			var oView = this.getView(),
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "sap_IconTabBar_Page_0-content-build_simple_Table-1603401989095-items-build_simple_Row-1-cells-build_simple_TableCell-1603402033067-content-sap_m_HBox-1603402039393-items-sap_m_TextArea-1603402066504"
				}];
			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			if (status) {
				return new Promise(function (fnResolve, fnReject) {
					var oModel = oController.oModel;

					var fnResetChangesAndReject = function (sMessage) {
						oModel.resetChanges();
						fnReject(new Error(sMessage));
					};
					if (oModel && oModel.hasPendingChanges()) {
						oModel.submitChanges({
							success: function (oResponse) {
								var oBatchResponse = oResponse.__batchResponses[0];
								var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
								if (oChangeResponse && oChangeResponse.data) {
									var sNewContext = oModel.getKey(oChangeResponse.data);
									oView.unbindObject();
									oView.bindObject({
										path: "/" + sNewContext
									});
									if (window.history && window.history.replaceState) {
										window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext),
											encodeURIComponent(sNewContext)));
									}
									oModel.refresh();
									fnResolve();
								} else if (oChangeResponse && oChangeResponse.response) {
									fnResetChangesAndReject(oChangeResponse.message);
								} else if (!oChangeResponse && oBatchResponse.response) {
									fnResetChangesAndReject(oBatchResponse.message);
								} else {
									oModel.refresh();
									fnResolve();
								}
							},
							error: function (oError) {
								fnReject(new Error(oError.message));
							}
						});
					} else {
						fnResolve();
					}
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			}
		},
		handleChangeValuestate: function (requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function (requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (input) {
						input.setValueState("None"); //initially set ValueState to None
						if (input.getValue() === '') {
							input.setValueState("Error"); //input is blank set ValueState to error
							status = false;
						} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
							input.setValueState("Error"); //Invalid Date set ValueState to error
							status = false;
						}
					}
				});
			}
			return status;

		},
		_onButtonPress1: function (oEvent) {

			var oSource = oEvent.getSource();
			var oSourceBindingContext = oSource.getBindingContext();

			return new Promise(function (fnResolve, fnReject) {
				if (oSourceBindingContext) {
					var oModel = oSourceBindingContext.getModel();

					var oData = oModel._getObject("", oSourceBindingContext, true);

					if (!oData) {
						oModel.read(oSourceBindingContext.sPath, {
							success: function (oData) {
								var sKey = oModel.getKey(oData);
								oData["CantidadEntregada"] = "-1";
								oModel.update('/' + sKey, oData, {
									success: fnResolve,
									error: fnReject,
									refreshAfterChange: true
								});
							},
							error: fnReject
						});
					} else {
						var sKey = oModel.getKey(oData);
						oData["CantidadEntregada"] = "-1";
						oModel.update('/' + sKey, oData, {
							success: fnResolve,
							error: fnReject,
							refreshAfterChange: true
						});
					}
				}
			});

		},
		_onButtonPress2: function (oEvent) {

			var oSource = oEvent.getSource();
			var oSourceBindingContext = oSource.getBindingContext();

			return new Promise(function (fnResolve, fnReject) {
				if (oSourceBindingContext) {
					var oModel = oSourceBindingContext.getModel();

					var oData = oModel._getObject("", oSourceBindingContext, true);

					if (!oData) {
						oModel.read(oSourceBindingContext.sPath, {
							success: function (oData) {
								var sKey = oModel.getKey(oData);
								oData["CantidadEntregada"] = "+1";
								oModel.update('/' + sKey, oData, {
									success: fnResolve,
									error: fnReject,
									refreshAfterChange: true
								});
							},
							error: fnReject
						});
					} else {
						var sKey = oModel.getKey(oData);
						oData["CantidadEntregada"] = "+1";
						oModel.update('/' + sKey, oData, {
							success: fnResolve,
							error: fnReject,
							refreshAfterChange: true
						});
					}
				}
			});

		},
		_onButtonPress3: function () {
			var oView = this.getView(),
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "sap_IconTabBar_Page_0-content-build_simple_Table-1603401989095-items-build_simple_Row-1-cells-build_simple_TableCell-1603402033067-content-sap_m_HBox-1603402039393-items-sap_m_TextArea-1603402066504"
				}];
			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			if (status) {
				return new Promise(function (fnResolve, fnReject) {
					var oModel = oController.oModel;

					var fnResetChangesAndReject = function (sMessage) {
						oModel.resetChanges();
						fnReject(new Error(sMessage));
					};
					if (oModel && oModel.hasPendingChanges()) {
						oModel.submitChanges({
							success: function (oResponse) {
								var oBatchResponse = oResponse.__batchResponses[0];
								var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
								if (oChangeResponse && oChangeResponse.data) {
									var sNewContext = oModel.getKey(oChangeResponse.data);
									oView.unbindObject();
									oView.bindObject({
										path: "/" + sNewContext
									});
									if (window.history && window.history.replaceState) {
										window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext),
											encodeURIComponent(sNewContext)));
									}
									oModel.refresh();
									fnResolve();
								} else if (oChangeResponse && oChangeResponse.response) {
									fnResetChangesAndReject(oChangeResponse.message);
								} else if (!oChangeResponse && oBatchResponse.response) {
									fnResetChangesAndReject(oBatchResponse.message);
								} else {
									oModel.refresh();
									fnResolve();
								}
							},
							error: function (oError) {
								fnReject(new Error(oError.message));
							}
						});
					} else {
						fnResolve();
					}
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			}
		},
		_onButtonPress4: function (oEvent) {

			var oSource = oEvent.getSource();
			var oSourceBindingContext = oSource.getBindingContext();

			return new Promise(function (fnResolve, fnReject) {
				if (oSourceBindingContext) {
					var oModel = oSourceBindingContext.getModel();

					var oData = oModel._getObject("", oSourceBindingContext, true);

					if (!oData) {
						oModel.read(oSourceBindingContext.sPath, {
							success: function (oData) {
								var sKey = oModel.getKey(oData);
								oData["CantidadGastada"] = "-1";
								oModel.update('/' + sKey, oData, {
									success: fnResolve,
									error: fnReject,
									refreshAfterChange: true
								});
							},
							error: fnReject
						});
					} else {
						var sKey = oModel.getKey(oData);
						oData["CantidadGastada"] = "-1";
						oModel.update('/' + sKey, oData, {
							success: fnResolve,
							error: fnReject,
							refreshAfterChange: true
						});
					}
				}
			});

		},
		_onButtonPress5: function (oEvent) {

			var oSource = oEvent.getSource();
			var oSourceBindingContext = oSource.getBindingContext();

			return new Promise(function (fnResolve, fnReject) {
				if (oSourceBindingContext) {
					var oModel = oSourceBindingContext.getModel();

					var oData = oModel._getObject("", oSourceBindingContext, true);

					if (!oData) {
						oModel.read(oSourceBindingContext.sPath, {
							success: function (oData) {
								var sKey = oModel.getKey(oData);
								oData["CantidadGastada"] = "+1";
								oModel.update('/' + sKey, oData, {
									success: fnResolve,
									error: fnReject,
									refreshAfterChange: true
								});
							},
							error: fnReject
						});
					} else {
						var sKey = oModel.getKey(oData);
						oData["CantidadGastada"] = "+1";
						oModel.update('/' + sKey, oData, {
							success: fnResolve,
							error: fnReject,
							refreshAfterChange: true
						});
					}
				}
			});

		},
		_onButtonPress6: function () {
			var oView = this.getView(),
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "sap_IconTabBar_Page_0-content-build_simple_Table-1603401989095-items-build_simple_Row-1-cells-build_simple_TableCell-1603402033067-content-sap_m_HBox-1603402039393-items-sap_m_TextArea-1603402066504"
				}];
			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			if (status) {
				return new Promise(function (fnResolve, fnReject) {
					var oModel = oController.oModel;

					var fnResetChangesAndReject = function (sMessage) {
						oModel.resetChanges();
						fnReject(new Error(sMessage));
					};
					if (oModel && oModel.hasPendingChanges()) {
						oModel.submitChanges({
							success: function (oResponse) {
								var oBatchResponse = oResponse.__batchResponses[0];
								var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
								if (oChangeResponse && oChangeResponse.data) {
									var sNewContext = oModel.getKey(oChangeResponse.data);
									oView.unbindObject();
									oView.bindObject({
										path: "/" + sNewContext
									});
									if (window.history && window.history.replaceState) {
										window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext),
											encodeURIComponent(sNewContext)));
									}
									oModel.refresh();
									fnResolve();
								} else if (oChangeResponse && oChangeResponse.response) {
									fnResetChangesAndReject(oChangeResponse.message);
								} else if (!oChangeResponse && oBatchResponse.response) {
									fnResetChangesAndReject(oBatchResponse.message);
								} else {
									oModel.refresh();
									fnResolve();
								}
							},
							error: function (oError) {
								fnReject(new Error(oError.message));
							}
						});
					} else {
						fnResolve();
					}
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			}
		},
		updateBindingOptions: function (sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		createFiltersAndSorters: function () {
			this.mBindingOptions = {};
			var oBindingData, aPropertyFilters;
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("IDHojaDeGasto", "EQ", "66945"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, false));

			this.updateBindingOptions(
				"sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1-content-build_simple_Table-1", oBindingData);
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("IDHojaDeGasto", "EQ", "66945"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, false));

			this.updateBindingOptions("sap_IconTabBar_Page_0-content-build_simple_Table-1603401989095", oBindingData);
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("IDHojaDeGasto", "EQ", "66945"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, false));

			this.updateBindingOptions(
				"sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-5-content-build_simple_Table-1603402013127",
				oBindingData);
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("IDHojaDeGasto", "EQ", "66945"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, false));

			this.updateBindingOptions(
				"sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1603401943200-content-build_simple_Table-1603402019374",
				oBindingData);

		},
		applyFiltersAndSorters: function (sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetalleHojaDeGasto").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function () {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function () {
								this.oRouter.navTo("", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

			this.oModel = this.getOwnerComponent().getModel();

			this.mAggregationBindingOptions = {};
			this.createFiltersAndSorters();

			this.applyFiltersAndSorters(
				"sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1-content-build_simple_Table-1", "items");

			this.applyFiltersAndSorters("sap_IconTabBar_Page_0-content-build_simple_Table-1603401989095", "items");

			this.applyFiltersAndSorters(
				"sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-5-content-build_simple_Table-1603402013127", "items");

			this.applyFiltersAndSorters(
				"sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1603401943200-content-build_simple_Table-1603402019374",
				"items");

		},
		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1-content-build_simple_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_HBox-1605394638558-items-sap_m_ComboBox-4",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-build_simple_Table-1603401989095",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-build_simple_Table-1603401989095-items-build_simple_Row-1-cells-build_simple_TableCell-1603490767479-content-sap_m_ComboBox-1603490774528",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-5-content-build_simple_Table-1603402013127",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1603401943200-content-build_simple_Table-1603402019374",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		}
	});
}, /* bExport= */ true);