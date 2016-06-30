
function ObjectContent(tabContentID) {
	this.objectAddButton = null;
	this.objectSelectList = null;
	GuiTabContent.call(this, tabContentID);
}

gGuiBase.Core.inheritPrototype(ObjectContent, GuiTabContent);

ObjectContent.prototype.initialize = function () {
	this.objectAddButton = new Button("objectAddButton", "+Object");
	this.widgetList.push(this.objectAddButton);
	
	var testArray = ["list1", "list2", "list3"];
	this.objectSelectList = new SelectList("objectSelectList1", testArray);
	this.widgetList.push(this.objectSelectList);
	
};

ObjectContent.prototype.initializeEventHandling = function () {
	this.objectAddButton.setOnClick(this.buttonOnClick);
	this.objectSelectList.setOnSelect(onListSelect);

};

ObjectContent.prototype.buttonOnClick = function() {
	var list = gGuiBase.Core.findWidgetByID("#objectSelectList1")
	list.addElement("list item added");
	gGuiBase.Core.refreshAllTabContent();
};

var onListSelect = function(selectedElement) {
	console.log(selectedElement);
};



