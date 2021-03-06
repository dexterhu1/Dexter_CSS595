
function TransformContent(tabContentID, style, title) {
	this.isGameObjectCheck = null;
	this.objectNameText = null;
	this.objectName = null;
	this.objectXY = null;
	this.objectX = null;
	this.objectY = null;
	this.objectWH = null;
	this.objectW = null;
	this.objectH = null;
	this.rotationText = null;
	this.rotationField = null;
	this.rotationSlider = null;
	
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(TransformContent, GuiTabContent);

TransformContent.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 10px; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	var sliderStyle = 'width: 90%; margin-top: 10px; margin-bottom: 10px; margin-left: 10px';
	
	this.objectNameText = new Text("gameObjectNameText", textStyle, "Name");
	this.objectName = new TextField("gameObjectNameField", textFieldStyle, "GameObj0");
	this.objectXY = new Text("gameObjectXYText", textStyle, "X / Y");
	this.objectX = new TextField("gameObjectXField", textFieldStyle, "20");
	this.objectY = new TextField("gameObjectYField", textFieldStyle, "60");
	
	this.objectWH = new Text("gameObjectWHText", textStyle, "W / H");
	this.objectW = new TextField("gameObjectWField", textFieldStyle, "5");
	this.objectH = new TextField("gameObjectHField", textFieldStyle, "5");
	
	this.rotationText = new Text("gameObjectRotationText", textStyle, "Rotation");
	this.rotationField = new TextField("gameObjectRotationField", textFieldStyle, "0");
	this.rotationSlider = new Slider("gameObjectRotationSlider", sliderStyle);
	
	this.widgetList.push(this.objectNameText);
	this.widgetList.push(this.objectName);
	this.widgetList.push(this.objectXY);
	this.widgetList.push(this.objectX);
	this.widgetList.push(this.objectY);
	this.widgetList.push(this.objectWH);
	this.widgetList.push(this.objectW);
	this.widgetList.push(this.objectH);
	this.widgetList.push(this.rotationText);
	this.widgetList.push(this.rotationField);
	this.widgetList.push(this.rotationSlider);
	
};

TransformContent.prototype.initializeEventHandling = function () {
	this.objectName.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectX.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectY.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectW.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectH.setOnFocusOut(this.onTextFieldFocusOut);
	
	this.rotationSlider.setOnSliderChange(this.onSliderChange);
};

TransformContent.prototype.onTextFieldFocusOut = function() {
	//Can do all the handling for changing game object here
};

TransformContent.prototype.onSliderChange = function(sliderValue) {
	
};

TransformContent.prototype.updateFields = function( gameObject ) {
	//update these widgets...
	// set name field
	console.log( gameObject );
	this.objectName.setText( gameObject.mID );
	
	// set x form
	var xf = gameObject.getXform();

	
	console.log(xf);
	this.objectX.setText( xf.getXPos() );
	this.objectY.setText( xf.getYPos() );

	// set width and height
	this.objectW.setText( xf.getWidth() );
	this.objectH.setText( xf.getHeight() );
	
	this.rotationField.setText( xf.getRotationInDegree());

	// rotation is not implemented yet in the object
	// this.rotationText = new Text("gameObjectRotationText", textStyle, "Rotation");
	// this.rotationField = new TextField("gameObjectRotationField", textFieldStyle, "0");
	// this.rotationSlider = new Slider("gameObjectRotationSlider", sliderStyle);
};



