// QQPlay window need to be inited first
if (<%=isQQPlay%>) {
    BK.Script.loadlib('GameRes://libs/qqplay-adapter.js');
}

window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;

    if ( !settings.debug ) {
        var uuids = settings.uuids;

        var rawAssets = settings.rawAssets;
        var assetTypes = settings.assetTypes;
        var realRawAssets = settings.rawAssets = {};
        for (var mount in rawAssets) {
            var entries = rawAssets[mount];
            var realEntries = realRawAssets[mount] = {};
            for (var id in entries) {
                var entry = entries[id];
                var type = entry[1];
                // retrieve minified raw asset
                if (typeof type === 'number') {
                    entry[1] = assetTypes[type];
                }
                // retrieve uuid
                realEntries[uuids[id] || id] = entry;
            }
        }

        var scenes = settings.scenes;
        for (var i = 0; i < scenes.length; ++i) {
            var scene = scenes[i];
            if (typeof scene.uuid === 'number') {
                scene.uuid = uuids[scene.uuid];
            }
        }

        var packedAssets = settings.packedAssets;
        for (var packId in packedAssets) {
            var packedIds = packedAssets[packId];
            for (var j = 0; j < packedIds.length; ++j) {
                if (typeof packedIds[j] === 'number') {
                    packedIds[j] = uuids[packedIds[j]];
                }
            }
        }
    }

    function setLoadingDisplay () {
        // Loading splash scene
        var splash = document.getElementById('splash');
        var progressBar = splash.querySelector('.progress-bar span');
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            var percent = 100 * completedCount / totalCount;
            if (progressBar) {
                progressBar.style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        progressBar.style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
        });
    }

    var showLoading = function() {
        var scene = new cc.Scene();
        cc.director.runSceneImmediate(scene);
        var root = new cc.Node();
        var canvas = root.addComponent(cc.Canvas);
        root.parent = scene;
        canvas.fitHeight = false
        canvas.fitWidth = true
        canvas.designResolution = new cc.Size(720 ,1280);
        root.height = 1280
        root.width = 720
        // 健康游戏忠告
        var node = new cc.Node();
        var label = node.addComponent(cc.Label);
        label.string = "健康游戏忠告";
        label.fontSize = 50
        label.lineHeight = 60;
        node.parent = root;
        node.y = 220;
        // 八荣八耻
        var node = new cc.Node();
        var label = node.addComponent(cc.Label);
        label.string = "抵制不良游戏，拒绝盗版游戏\n注意自我保护，谨防受骗上当\n适度游戏益脑，沉迷游戏伤身\n合理安排时间，享受健康生活";
        label.fontSize = 42
        label.lineHeight = 60;
        node.parent = root;
        // // 版权
        // var node = new cc.Node();
        // var label = node.addComponent(cc.Label);
        // label.string = "批准文号:新广出审[2017]82号        出版物号:ISBN 978-7-7979-3656-9\n文网游备字[2016]M-CBG 0083号\n著作权人:深圳市金环天朗信息技术服务有限公司\n出版单位:北京艺术与科学电子出版社";
        // label.fontSize = 20
        // label.lineHeight = 32;
        // label.horizontalAlign = cc.Label.HorizontalAlign.CENTER
        // node.parent = root;
        // node.anchorY = 0
        // var widget = node.addComponent(cc.Widget);
        // widget.isAlignBottom = true;
        // widget.bottom = 30
    }

    var onStart = function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            showLoading();
        }
        
        cc.loader.downloader._subpackages = settings.subpackages;

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (!<%=isWeChatGame%> && !<%=isQQPlay%>) {
            if (cc.sys.isBrowser) {
                setLoadingDisplay();
            }

            if (cc.sys.isMobile) {
                if (settings.orientation === 'landscape') {
                    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                }
                else if (settings.orientation === 'portrait') {
                    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                }
                cc.view.enableAutoFullScreen([
                    cc.sys.BROWSER_TYPE_BAIDU,
                    cc.sys.BROWSER_TYPE_WECHAT,
                    cc.sys.BROWSER_TYPE_MOBILE_QQ,
                    cc.sys.BROWSER_TYPE_MIUI,
                ].indexOf(cc.sys.browserType) < 0);
            }

            // Limit downloading max concurrent task to 2,
            // more tasks simultaneously may cause performance draw back on some android system / browsers.
            // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
            if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
                cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
            }
        }

        var launchScene = settings.launchScene;
        var timeout = 0
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            timeout = 3000
        }
        setTimeout(function () {
            // load scene
            cc.director.loadScene(launchScene, null,
              function () {
                if (cc.sys.isBrowser) {
                  // show canvas
                  var canvas = document.getElementById('GameCanvas');
                  canvas.style.visibility = '';
                  var div = document.getElementById('GameDiv');
                  if (div) {
                    div.style.backgroundImage = '';
                  }
                }
                cc.loader.onProgress = null;
                console.log('Success to load scene: ' + launchScene);
              }
            );
          }, timeout);
    };

    // jsList
    var jsList = settings.jsList;

    if (<%=isQQPlay%>) {
        BK.Script.loadlib(<%=projectCode%>);
    }
    else {
        var bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';
        if (jsList) {
            jsList = jsList.map(function (x) {
                return 'src/' + x;
            });
            jsList.push(bundledScript);
        }
        else {
            jsList = [bundledScript];
        }
    }
    <Inject anysdk scripts>
    var option = {
        id: 'GameCanvas',
        scenes: settings.scenes,
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !<%=isWeChatSubdomain%> && settings.debug,
        frameRate: 60,
        jsList: jsList,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    }

    // init assets
    cc.AssetLibrary.init({
        libraryPath: 'res/import',
        rawAssetsBase: 'res/raw-',
        rawAssets: settings.rawAssets,
        packedAssets: settings.packedAssets,
        md5AssetsMap: settings.md5AssetsMap,
        subpackages: settings.subpackages
    });

    cc.game.run(option, onStart);
};

// main.js is qqplay and jsb platform entry file, so we must leave platform init code here
if (<%=isQQPlay%>) {
    BK.Script.loadlib('GameRes://src/settings.js');
    BK.Script.loadlib(<%=engineCode%>);
    BK.Script.loadlib('GameRes://libs/qqplay-downloader.js');

    var ORIENTATIONS = {
        'portrait': 1,
        'landscape left': 2,
        'landscape right': 3
    };
    BK.Director.screenMode = ORIENTATIONS[window._CCSettings.orientation];
    initAdapter();
    cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
        initRendererAdapter();
    });

    qqPlayDownloader.REMOTE_SERVER_ROOT = "";
    var prevPipe = cc.loader.md5Pipe || cc.loader.assetLoader;
    cc.loader.insertPipeAfter(prevPipe, qqPlayDownloader);
    <Inject plugin code>
    window.boot();
}
else if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
        require('src/settings.js');
        require('src/cocos2d-runtime.js');
        require('jsb-adapter/engine/index.js');
    }
    else {
        require('src/settings.js');
        require('src/cocos2d-jsb.js');
        require('jsb-adapter/jsb-engine.js');
    }
    window.boot();
}