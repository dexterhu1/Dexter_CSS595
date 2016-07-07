/*
 * File: GameCore.js 
 * This is created when the application starts.
 * It has all the game data and the starting code that makes the application run. 
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, GameObject, Scene, Camera, vec2, gNextObjectID, gCurrentScene */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameCore() {
    gCurrentScene = new ClientScene(0);
    
    // Objects and textures are shared among all scenes
    
    this.mGO = {};   // Objects are stored as key value pairs, where the key = objectName, value = [go, code]
    this.mTextureList = [];
    this.mSceneList = [];   // Each scene has its own instance list AND camera list
    
    // Add one scene for starters (and run it)
    this.mSceneList.push(gCurrentScene);
    gEngine.View.initializeEngineCore('GLCanvas', gCurrentScene);

    this.mSelectedCamera = null;    // Cam
    this.mSelected = null;          // GO, Class, or instance of GO or Class
}

GameCore.prototype.getObjectList = function() {
    var objList = [];
    for (var objName in this.mGO) {
        objList.push(objName);
    }
    return objList;
};

GameCore.prototype.getTextureList = function() {
    return this.mTextureList;
};

GameCore.prototype.getCameraList = function() {
    return this.mCameraList;
};

GameCore.prototype.getSceneList = function() {
    return this.mSceneList;
};

GameCore.prototype.getSelected = function() {
    return this.mSelected;
};

GameCore.prototype.setSelected = function(obj) {
    this.mSelected = obj;
};

// creates a default object returns objects name as string
// GameCore.prototype.createDefaultObject = function() {
//     var obj;
//
//     // create new default name, this should be its own function
//     var name = "GameObj" + gNextObjectID;
//     while (this.checkForNameConflict(name)) {
//         gNextObjectID++; // This has not been incremented yet so do it here.  After this method is over, + Object will increment it to a unique value.
//         name = "GameObj" + gNextObjectID;
//     }
//     // end of creating default name
//
//     window[name] = function(renderableObj) {
//         GameObject.call(this, renderableObj);
//     };
//
//     gEngine.View.inheritPrototype(window[name], window["GameObject"]);
//
//     var code = getDefaultCodeGO(name);
//
//     // Add code to system
//     eval(code);
//     eval('obj = new ' + name + '(new Renderable());');
//     // Make a default xform
//     var xf = obj.getXform();
//     xf.setXPos(20);
//     xf.setYPos(60);
//     xf.setWidth(5);
//     xf.setHeight(5);
//
//     obj.mID = name;
//
//     var entry = [obj, code]; // OLD CODE [obj, code, type = 1] type = 1
//     this.mGO[name] = entry;
//     this.mSelected = entry;
//     // cleanUpPanelRightBody();
//     if (!gRunning) {
//         // Updated current list item in View after this is called
//         // createDetailsObjects(type);
//     }
//     // todo find out if this is referenced anywhere type = 2 reset class of referenced object
//     // } else {
//     //     // this seems to be a seperate function designed to reset an object....
//     //     // Reset class
//     //     window[name] = function() {
//     //
//     //     };
//     //
//     //     var code = getDefaultCodeClass(name, "objectListItem" + number);
//     //
//     //     // Instantiate with eval to allow using a string name when creating a new class
//     //     eval('obj = new ' + name + '();');
//     //
//     //     var newObj = [obj, code, type] // this is still type 2? what does that mean
//     //     this.mObjectList[this.mObjectList.length] = newObj; // type = 0
//     //     this.mGO[name] = newObj;
//     //     this.mSelected = newObj;
//     //     // cleanUpPanelRightBody();
//     //     if (!gRunning) {
//     //         // Updated current list item in View after this is called
//     //         // createDetailsObjects(type); // THIS SHOULD BE DONE IN VIEW!!!!
//     //     }
//     // }
//     // return the name for view so that it can be used to reference object
//     return obj;
// };

GameCore.prototype.deleteObjectAt = function(index) {
    // Remove the object at an index
    if (index > -1) {
        // Remove all instances of this object
        var id = this.mObjectList[index][0].mID;    // Raw ID (with "objectListItem" attached)
        id = id.substring(14, id.length);           //Just the suffix of the raw ID
        var i;
        var list = this.getInstanceList();
        
        // Loop and remove the instances
        for (i = 0; i < list.length; i++) {
            var id2 = list[i].mID;                 // Same deal here.  Cut off "instanceListItem"
            if (id2.substring(16, id2.length) === id) {
                list.splice(i, 1);
                i--;    // Spliced one.  Now we have to decrement i so when it does i++, we don't advance
            }
        }
        
        // Now refresh the bottom panel
        createPanelBottomInstances();
        
        // Empty the code, then delete the object
        window[this.mObjectList[index][0].mName] = function() {
        
        };
        // Finally, splice it.  View handles updating the side panel, since it has the relevant info.
        this.mObjectList.splice(index, 1);
        
        this.mSelected = null;
    }
};

// get object by its ID
GameCore.prototype.getObject = function(objID) {
    var obj = this.mGO[objID][0]
    if (obj === undefined) throw objID + " has not been created";
    else return obj;
};

GameCore.prototype.select = function(index) {
    // Select the object at the index
    this.mSelected = this.mObjectList[index];
    cleanUpPanelRightBody();
    if (!gRunning) {
        changeCurrentListItem(this.mSelected[0].mID);
        createDetailsObjects(this.mSelected[2]);
    }
    if ($('#panelBottomInstances').hasClass('current-tab')) {
        createPanelBottomInstancesSelect(this.mSelected[0].mName);
    }
    return this.mSelected;
};

GameCore.prototype.selectCamera = function(index) {
    // Select the camera at the index
    var list = gCurrentScene.getCameraList();
    this.mSelectedCamera = list[index];
    createPanelBottomCameras();
    cleanUpPanelRightBody();
    if (!gRunning) {
        changeCurrentListItem(this.mSelectedCamera.mID);
        createDetailsCameras();
    }
    return this.mSelectedCamera;
};


GameCore.prototype.createDefaultCamera = function(number) {
    var cam = new Camera(
        vec2.fromValues(20,60), // position of the camera
        50,                     // width of camera
        [0,0,640,480]           // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    var name = "Camera" + number;

    while (this.checkForNameConflictCamera(name)) {
        gCurrentScene.mNextCameraID++;
        name = "Camera" + gCurrentScene.mNextCameraID;
    }
    cam.mName = name;
    cam.mID = "cameraListItem" + number; // This is still unique despite the check (doesn't need to be updated to the next cam id)
    gCurrentScene.mNextCameraID++;
    //gCurrentScene.addCamera(cam);  // The scene already adds it for us so we don't need to add it again
    var list = gCurrentScene.getCameraList();
    this.selectCamera(list.length - 1); // Refreshes
};

GameCore.prototype.getSelectedCamera = function() {
    return this.mSelectedCamera;
};

GameCore.prototype.deleteCamera = function(index) {
    var wasCurrentCam = false;
    // Delete the camera.  If the instance is also the camera, then clean up the panel
    var list = gCurrentScene.getCameraList();
    var cam = list[index];
    if (this.mSelectedCamera === cam) {
        cleanUpPanelRightBody();
        this.mSelectedCamera = null;
        wasCurrentCam = true;
    }
    list.splice(index, 1);
    
    // No need to check if the camera tab is open.  It MUST be open if you're deleting a camera.
    createPanelBottomCameras();
    if (!wasCurrentCam) {
        changeCurrentListItem(this.mSelectedCamera.mID);
    }
};

GameCore.prototype.getCameraList = function() {
    return gCurrentScene.getCameraList();
};


GameCore.prototype.checkForNameConflict = function(name) {
    // Returns true if the name appears more than once
    var obj = this.mGO[name];
    return (obj !== undefined) 
};

GameCore.prototype.checkForNameConflictScene = function(name) {
    // Returns true if the name appears more than once
    var result = false;
    var i;
    for (i = 0; i < this.mSceneList.length; i++) {
        if (this.mSceneList[i].mName === name) {
            result = true;
            i = this.mSceneList.length; // Break
        }
    }
    return result;
};

GameCore.prototype.checkForNameConflictCamera = function(name) {
    // Returns true if the name appears more than once
    var result = false;
    var i;
    var list = gCurrentScene.getCameraList();
    for (i = 0; i < list.length; i++) {
        if (list[i].mName === name) {
            result = true;
            i = list.length; // Break
        }
    }
    return result;
};

GameCore.prototype.createDefaultScene = function(number) {
    // Create a default scene with a default name.  It becomes the selected scene.
    var scene = new ClientScene(number);
    while (this.checkForNameConflictScene(scene.mName)) {
        gNextSceneID++; // This has not been incremented yet so do it here.  After this method is over, + Scene will increment it to a unique value.
        scene.mName = "Scene" + gNextSceneID;
    }
    this.mSceneList.push(scene);

    // Set selected scene
    this.selectScene(this.mSceneList.length - 1);
    cleanUpPanelRightBody();
    if (!gRunning) {
        // Updated current list item in View after this is called
        createDetailsScenes();
    }
};

GameCore.prototype.selectScene = function(index) {
    // Select the scene at the index and run it too
    gEngine.GameLoop.stop();
    if (index !== null) {
        gCurrentScene = this.mSceneList[index];
        gEngine.View.startScene(gCurrentScene);
    } else {
        this.runBlankScene();
    }
    return gCurrentScene;
};

//
// var getDefaultCodeGO = function(name) {
//     return 'window["' + name + '"] = function(renderableObj) {\n\
//     GameObject.call(this, renderableObj);\n\
//     this.mCollidableFlag = false;\n\
//     this.mCollisionPixelFlag = false;\n\
//     this.mDestroy = false;\n\
// }\n\
// gEngine.View.inheritPrototype(window["' + name + '"], window["GameObject"]);\n\
// \n\
// ' + name + '.prototype.update = function() {\n\
//     GameObject.prototype.update.call(this);\n\
// };\n\
// \n\
// ' + name + '.prototype.draw = function(aCamera) {\n\
//     GameObject.prototype.draw.call(this, aCamera);\n\
// };\n\
// \n\
// ' + name + '.prototype.onCollisionStay = function(otherObj) {\n\
//     \n\
// };\n\
// \n\
// ' + name + '.prototype.onCollisionEnter = function(otherObj) {\n\
//     \n\
// };\n\
// \n\
// ' + name + '.prototype.onCollisionExit = function(otherObj) {\n\
//     \n\
// };';
// };
//
// var getDefaultCodeClass = function(name, id) {
//     return 'window["' + name + '"] = function() {\n\
//     this.mName = "' + name + '";\n\
//     this.mID = "' + id + '";\n\
// }';
// };