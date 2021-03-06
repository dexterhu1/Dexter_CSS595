//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.SceneSupport = (function() {
	var gCurrentScene = new ClientScene(0);
	
    var mSceneList = [];
    var mNextSceneID = 0;
    
	mSceneList.push(gCurrentScene);
    gEngine.View.initializeEngineCore('GLCanvas', gCurrentScene);
	
	var selectScene = function(index) {
		gEngine.GameLoop.stop();
		if (index !== null) {
			gGuiBase.SceneSupport.gCurrentScene = mSceneList[index];
			gEngine.View.startScene(gGuiBase.SceneSupport.gCurrentScene);
			gGuiBase.Core.reinitializeCameraTab();
			
		} else {
			this.runBlankScene();
		}
		return gCurrentScene;
	};
	
	
    // returns true if name is already in use
    var checkForNameConflict = function(name) {
        var result = false;
		var i;
		for (i = 0; i < mSceneList.length; i++) {
			if (mSceneList[i].mName === name) {
				result = true;
				i = mSceneList.length; // Break
			}
		}
		return result;
    };
	
    var createDefaultScene = function() {
		// Create a default scene with a default name.  It becomes the selected scene.
		var name = "Scene" + mNextSceneID;
		while (checkForNameConflict(name)) {
			mNextSceneID++; // This has not been incremented yet so do it here.  After this method is over, + Scene will increment it to a unique value.
			name = "Scene" + mNextSceneID;
		}
	
		var scene = new ClientScene(mNextSceneID);
		mSceneList.push(scene);
		selectScene(mSceneList.length - 1);
		
		
		return scene;
	};
    
	var deleteScene = function(sceneName) {
		var scene = getSceneByName(sceneName);
		var index = getSceneIndex(sceneName);
		if (gGuiBase.SceneSupport.gCurrentScene === scene) {
			gGuiBase.Core.emptyDetailsTab();
		}
	
		mSceneList.splice(index, 1);
		gGuiBase.Core.reinitializeSceneTab();
		gGuiBase.View.refreshAllTabContent();
	};
	
	var getSceneIndex = function(sceneName) {
		var i;
		for (i = 0; i < mSceneList.length; i++) {
			if (mSceneList[i].mName === name) {
				return i;
			}
		}
		return -1;
	};
	
	
	var runBlankScene = function() {
		var blank = new ClientScene(-1);
		gCurrentScene = blank;
		blank.mName = "";
		blank.mID = "sceneListItemBlank";
		gEngine.Core.startScene(blank);
		blank.mAllCamera[1] = new Camera(
			vec2.fromValues(20,60),   // position of the camera
			50,                        // width of camera
			[0,0,640,480]        // viewport (orgX, orgY, width, height)
		);
		blank.mAllCamera[1].setBackgroundColor([77.0/256, 73.0/256, 72.0/256, 1]); // That's #4d4948, the background color
	};

	var selectSceneByName = function(name) {
		// Select the scene at the index and run it too
		
		gEngine.GameLoop.stop();
		if (name !== null) {
			gGuiBase.SceneSupport.gCurrentScene = getSceneByName(name);
			gGuiBase.Core.reinitializeCameraTab();
			gEngine.View.startScene(gGuiBase.SceneSupport.gCurrentScene);
			
		} else {
			runBlankScene();
		}
		
		return gCurrentScene;
	};

    var getSceneByName = function( name ) {
        var result = null;
		var i;
		for (i = 0; i < mSceneList.length; i++) {
			if (mSceneList[i].mName === name) {
				result = mSceneList[i];
				i = mSceneList.length; // Break
			}
		}
		return result;
    };

    var getSceneList = function() {
		
        return mSceneList;
    };
	
	var getSceneListNames = function() {
		var nameArray = [];
		for (i = 0; i < mSceneList.length; i++) {
			nameArray.push(mSceneList[i].mName);
		}
		return nameArray;
	}

    var mPublic = {
		gCurrentScene: gCurrentScene,
        createDefaultScene: createDefaultScene,
        checkForNameConflict: checkForNameConflict,
        getSceneList: getSceneList,
        getSceneByName: getSceneByName,
		getSceneListNames: getSceneListNames,
		selectSceneByName: selectSceneByName,
		selectScene: selectScene,
		deleteScene: deleteScene,
    };
    return mPublic;
}());