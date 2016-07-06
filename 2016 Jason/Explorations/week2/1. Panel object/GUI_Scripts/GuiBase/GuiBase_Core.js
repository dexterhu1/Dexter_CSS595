//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.Core = (function() {
	var initializeInitialScene = function() {
		gGuiBase.View.findWidgetByID("#sceneSelectList1").rebuildWithArray(gGuiBase.SceneSupport.getSceneListNames());
		gGuiBase.SceneSupport.selectScene(0);
		
		gGuiBase.View.findWidgetByID("#cameraSelectList").rebuildWithArray(gGuiBase.CameraSupport.getCameraListNames());
		gGuiBase.View.refreshAllTabContent();
	};
	
    // Adds a default gameObject to the Object Tab and updates detail tab with this object
    var addDefaultObject = function () {
        var newObjID = gGuiBase.ObjectSupport.createDefaultObject();                    // create new gameObj
        //todo: abstract this to a content function call
        gGuiBase.View.findWidgetByID("#objectSelectList1").addElement( newObjID );      // add to obj panel
        this.selectDetailsObject( newObjID );                                           // select this object in details
        gGuiBase.View.refreshAllTabContent();                                           // refresh panel
    };
	
	var addDefaultScene = function() {
		var newScene = gGuiBase.SceneSupport.createDefaultScene();
		//gGuiBase.View.findWidgetByID("#sceneSelectList1").addElement(newScene.mName);
		gGuiBase.View.findWidgetByID("#sceneSelectList1").rebuildWithArray(gGuiBase.SceneSupport.getSceneListNames());
		this.selectDetailsScene(newScene.mName);
		gGuiBase.View.refreshAllTabContent();
	};

	var addDefaultCamera = function() {
		var newCamera = gGuiBase.CameraSupport.createDefaultCamera();
		gGuiBase.View.findWidgetByID("#cameraSelectList").rebuildWithArray(gGuiBase.CameraSupport.getCameraListNames());
		this.selectDetailsCamera(newCamera.mName);
		gGuiBase.View.refreshAllTabContent();
	};

    // updates the details tab with the object whose name is passed as parameter
    var selectDetailsObject = function ( objName ) {
        var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
		var detailsTransform = new TransformContent("TransformContent", gGuiBase.View.CONTENT_STYLE, "Transform");
		var detailsColorTexture = new ColorTextureContent("ColorTextureContent", gGuiBase.View.CONTENT_STYLE, "Texture");
		
		var gameObject = gGuiBase.ObjectSupport.getGameObjectByID( objName );           // get gameObj
		detailsTransform.updateFields(gameObject);
		
		detailsTab.addContent(detailsTransform);
		detailsTab.addContent(detailsColorTexture);
		
		//var transformContent = gGuiBase.View.findTabContentByID("#TransformContent");
		//transformContent.updateFields(gameObject);
        gGuiBase.View.refreshAllTabContent();                                           // refresh panel
    };
	
	var selectDetailsScene = function (sceneName) {
		var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
		var detailsTransform = new SceneTransformContent("SceneTransformContent", gGuiBase.View.CONTENT_STYLE, "Scene");
		
		var scene = gGuiBase.SceneSupport.getSceneByName(sceneName);
		detailsTransform.updateFields(scene);
		gGuiBase.SceneSupport.selectSceneByName(sceneName);
		
		detailsTab.addContent(detailsTransform);
		gGuiBase.View.refreshAllTabContent();
	};
	
	var selectDetailsCamera = function (cameraName) {
		var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
		var detailsTransform = new CameraTransformContent("CameraTransformContent", gGuiBase.View.CONTENT_STYLE, "Camera Transform");
		var detailsColorTexture = new ColorTextureContent("ColorTextureContent", gGuiBase.View.CONTENT_STYLE, "Camera Color");
		
		var camera = gGuiBase.CameraSupport.getCameraByName(cameraName);
		detailsTransform.updateFields(camera);
	
		detailsTab.addContent(detailsTransform);
		detailsTab.addContent(detailsColorTexture);
		gGuiBase.View.refreshAllTabContent();
	};
	
	
	
	var emptyDetailsTab = function () {
		var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
	};

    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var mPublic = {
        addDefaultObject: addDefaultObject,
        selectDetailsObject: selectDetailsObject,
		addDefaultScene: addDefaultScene,
		selectDetailsScene: selectDetailsScene,
		initializeInitialScene: initializeInitialScene,
		addDefaultCamera: addDefaultCamera,
		selectDetailsCamera: selectDetailsCamera,

        inheritPrototype: inheritPrototype
    };
    return mPublic;

}());