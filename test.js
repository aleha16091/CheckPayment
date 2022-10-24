if ( "undefined" == typeof ColorZilla || !ColorZilla ) {
    var ColorZilla={};
    var cz=ColorZilla;
    cz.Background={
        "init": function(){
            cz.Background.setupListeners()
            ,cz.Background.currentColor=null,
            cz.Background.lastSampledColor=null,
            cz.Background.colorWasSampled=!1,
            cz.Background.readOptions(),
            cz.Background.history=cz.ColorHistory,
            setTimeout(function(){
                cz.Background.showWelcomePageIfNeeded()},200)
            ,setTimeout(function(){
                cz.Background.injectScriptsIntoExistingTabs()},20)
            ,cz.Background.initMainIconImageData()},
            "injectScriptsIntoExistingTabs":function(){
                chrome.windows.getAll({"populate":!0},
                function(a){
                    a.forEach(function(a){
                        a.tabs.forEach(function(a){
                            a&&a.url&&0==a.url.indexOf("http")&&chrome.tabs.executeScript(a.id,{"file":"/js/global-shortcut.js"})
                        })
                    })
                })
            },
            "readOption":function(a,b){
                return a in localStorage?localStorage[a]:b},
                "writeOption":function(a,b){
                    localStorage[a]=b},
                "readOptions":function(){
                    cz.Background.options={},
                    cz.Background.options.autostartEyedropper="true"==cz.Background.readOption("option-autostart-eyedropper","true"),
                    cz.ChromeUtils.platformSupportsNonForegroundHover()||(cz.Background.options.autostartEyedropper=!1),
                    cz.Background.options.outlineHovered="true"==cz.Background.readOption("option-outline-hovered","true"),
                    cz.Background.options.cursorCrosshair="true"==cz.Background.readOption("option-cursor-crosshair","true"),
                    cz.Background.options.showStatusPanel=!0,cz.Background.options.samplingMode=cz.Background.readOption("sampling-mode","1x1"),
                    cz.Background.options.autocopyToClipboard="true"==cz.Background.readOption("option-autocopy-to-clipboard","true"),
                    cz.Background.options.autocopyShowMessage="true"==cz.Background.readOption("option-autocopy-show-message","true"),
                    cz.Background.options.autocopyColorFormat=cz.Background.readOption("option-autocopy-color-format","hex"),
                    cz.Background.options.lowercaseHexa="true"==cz.Background.readOption("option-lowercase-hexa","false"),
                    cz.gbCZLowerCaseHexa=cz.Background.options.lowercaseHexa,
                    cz.Background.options.keyboardShortCutsEnabled="true"==cz.Background.readOption("option-keyboard-shortcuts-enabled","false"),
                    cz.Background.options.keyboardShortCutsChar=cz.Background.readOption("option-keyboard-shortcuts-char","Z"),
                    cz.Background.options.debugModeOn="true"==cz.Background.readOption("debug","false")},
                    "showWelcomePageIfNeeded":function(){
                        cz.ChromeUtils.getExtensionVersion(function(a){
                            var b=localStorage.version;
                            if (a!=b) {
                                localStorage.version=a;
                                var c;
                                "undefined"==typeof b?(b="-",c="new"):c="updated";
                                var d=cz.ChromeUtils.getChromeVersion(),
                                e="http://pages.colorzilla.com/chrome/welcome/"+c+"/?chrome/"+d+"/"+b+"/"+a;cz.ChromeUtils.openURLInNewTab(e)
                            }
                        })
                    },
                    "setupListeners":function(){
                        chrome.extension.onRequest.addListener(function(a,b,c){
                            switch(a.op){
                                case "already-injected-start-monitor":
                                    cz.Background.sendStartMonitoringMessage();
                                    break;
                                case "inject-and-start-monitor":
                                    cz.Background.injectAndStartMonitoring();
                                    break;
                                case "inject-and-analyze-page-colors": 
                                    cz.Background.injectAndAnalyzePageColors();
                                    break;
                                case "options-changed": 
                                    cz.Background.readOptions();
                                    break;
                                case "hotkey-pressed": 
                                    setTimeout(function(){
                                        cz.Background.onHotKeyPressed(a.keyCode)},20)
                            }
                        }),
                        chrome.extension.onConnect.addListener(function(a){
                            a.onMessage.addListener(function(a){
                                switch (a.op) {
                                    case "sampling-color":
                                        cz.Background.colorWasSampled||cz.Background.updateColor(a);
                                        break;
                                    case "color-sampled": 
                                        cz.Background.colorWasSampled=!0,setTimeout(function(){
                                            cz.Background.colorWasSampled=!1},2e3),
                                            cz.Background.setActiveColor(a),
                                            cz.Background.options.autocopyToClipboard&&cz.Background.copyColorToClipboard(a.color,cz.Background.options.autocopyColorFormat);
                                        break;
                                    case "take-screenshot": 
                                        cz.Background.takeScreenshot();
                                        break;
                                    case "page-colors-ready":
                                        var b=cz.Background.findPopupWindow();
                                        b&&b.colorAnalyzerUI.populatePageAnalyzerColors(a.colors);
                                        break;
                                    case "stopped-monitoring": 
                                        cz.Background.colorWasSampled||cz.Background.lastSampledColor&&cz.Background.setActiveColor({"color":cz.Background.lastSampledColor});
                                        break;
                                    case "kill-popup": 
                                        debugTrace("kill-popup message received");
                                        var b=cz.Background.findPopupWindow();
                                        b&&b.close();
                                        break;
                                    case "get-zoom-ratio": 
                                        chrome.tabs.getZoom(cz.Background.lastTabId,function(a){cz.Background.sendRequestToTab(cz.Background.lastTabId,{"op":"set-zoom-ratio","zoomRatio":a})});
                                        break;
                                    case "persist-option":
                                        cz.Background.writeOption(a.name,a.value),cz.Background.readOptions()
                                }
                            })
                        }),
                        chrome.tabs.onSelectionChanged.addListener(function(a,b){
                            cz.Background.stopMonitoring()}),
                        chrome.tabs.onUpdated.addListener(function(a,b,c){
                            0==c.url.indexOf("http")&&"complete"==b.status&&chrome.tabs.executeScript(a,{"file":"/js/global-shortcut.js"})
                        })
                    },
                    "findPopupWindow":function(){
                        var a=chrome.extension.getViews({"type":"popup"}),
                        b=a&&a.length>0&&a[0].ColorZilla&&a[0].ColorZilla.Popup?a[0].ColorZilla.Popup:null;
                        return b},
                    "onPopupClose":function(){
                        setTimeout(function(){
                            cz.Background.highlightElementsByColor(null)},100)},
                            "updateColor":function(a){var b=cz.Background.findPopupWindow();
                                return b&&b.mouseIsOverPopup&&a.op&&"sampling-color"==a.op?void setTimeout(function(){
                                    cz.Background.clearMonitoringHighlights()},20):void cz.Background.setActiveColor(a,b)
                            },
                            "setActiveColor":function(a,b){
                                var c=a.color;
                                "undefined"!=typeof b&&b||(b=cz.Background.findPopupWindow()),
                                "#"!=c.substr(0,1)&&(c=cz.czColToRGBHexaAttribute(cz.czRGBAttributeToCol(c))),
                                cz.Background.currentColor=c,cz.Background.setButtonColor(cz.Background.currentColor),
                                "color-sampled"==a.op&&(cz.Background.lastSampledColor=c,cz.Background.history.addColor(c)),
                                b&&b.setActiveColorAndData(cz.Background.currentColor,a)
                            },
                            "initMainIconImageData":function(){
                                var a=new Image;a.onload=function(){
                                    var b=document.createElement("canvas"),
                                    c=b.getContext("2d");
                                    c.drawImage(a,0,0);
                                    for (var d=c.getImageData(0,0,19,19),
                                        e=[],f=0;
                                        f<d.width;
                                        f++)
                                        for (var g=0;
                                            g<d.height;
                                            g++) {
                                                var h=4*(f+g*d.width),
                                                i=d.data[h+0],
                                                j=d.data[h+1],
                                                k=d.data[h+2],
                                                l=d.data[h+3];
                                                if  ( !(10>l||i==j&&j==k )) {
                                                    var m=cz.czRGBToHSV(i,j,k);
                                                    e[h]=m}
                                            }
                                            cz.Background.mainIconImageData=d,cz.Background.mainIconImageHSVData=e
                                        },
                                        a.src=chrome.extension.getURL("/images/main-icon-19.png")
                            },
                            "changeMainIconHueSat":function(a,b,c){
                                for( var d=cz.Background.mainIconImageData,e=0;e<d.width;e++ ) for ( var f=0;f<d.height;f++ ) {
                                    var g=4*(e+f*d.width),h=(d.data[g+0],d.data[g+1],d.data[g+2],d.data[g+3]),
                                    i=cz.Background.mainIconImageHSVData[g];
                                    if("undefined"!=typeof i){var j=25>b||60>c?0:i.s,k=cz.czHSVToRGB(a,j,i.v);d.data[g+0]=k.r,d.data[g+1]=k.g,d.data[g+2]=k.b,d.data[g+3]=h}}},
                            "setButtonColor":function(a){
                                var b=cz.czRGBHexaAttributeToCol(a);
                                chrome.browserAction.setBadgeText({"text":"\xb7"});
                                var c=cz.czGetRValue(b),
                                d=cz.czGetGValue(b),
                                e=cz.czGetBValue(b),
                                f=cz.czRGBToHSV(c,d,e);
                                chrome.browserAction.setBadgeBackgroundColor({"color":[c,d,e,255]}),
                                cz.Background.changeMainIconHueSat(f.h,f.s,f.v),
                                chrome.browserAction.setIcon({"imageData":cz.Background.mainIconImageData})},
                            "sendRequestToSelectedTab":function(a,b){
                                chrome.tabs.getSelected(null,function(c){
                                    cz.Background.lastTabId=c.id,chrome.tabs.sendRequest(c.id,a,b)})},
                            "sendRequestToSpecificTab":function(a,b,c){
                                chrome.tabs.sendRequest(a,b,c)},
                            "sendRequestToTab":function(a,b,c){
                                "undefined"!=typeof a?cz.Background.sendRequestToSpecificTab(a,b,c):cz.Background.sendRequestToSelectedTab(b,c)},
                            "executePageScriptDependingOnIfInjected":function(a,b){
                                chrome.tabs.executeScript(null,{
                                    "code":'if (typeof pageManager != "undefined") { '+a+" } else { "+b+" } "})},
                            "analyzePageColors":function(){
                                cz.Background.executePageScriptDependingOnIfInjected("pageManager.analyzePageColors()",
                                'chrome.extension.sendRequest({op:"inject-and-analyze-page-colors"})')},
                            "startMonitoring":function(){
                                cz.Background.lastSampledColor=cz.Background.currentColor,cz.Background.executePageScriptDependingOnIfInjected('chrome.extension.sendRequest({op:"already-injected-start-monitor"})',
                                'chrome.extension.sendRequest({op:"inject-and-start-monitor"})')},
                            "stopMonitoring":function(){
                                debugTrace("bg.stopMonitoring()"),
                                cz.Background.sendRequestToTab(cz.Background.lastTabId,{"op":"stop-monitoring"})},
                            "resampleLastLocation":function(){
                                cz.Background.takeScreenshot(function(){
                                    cz.Background.sendRequestToSelectedTab({"op":"resample-last-location"})})},
                            "clearMonitoringHighlights":function(){
                                cz.Background.sendRequestToTab(cz.Background.lastTabId,{"op":"clear-monitoring-highlights"})},
                            "highlightElementsByColor":function(a){
                                cz.Background.sendRequestToTab(cz.Background.lastTabId,{"op":"highlight-elements-by-color","colorRef":a})},
                            "injectAndPerformAction":function(a){
                                debugTrace("injecting"),chrome.tabs.executeScript(null,{"file":"js/content-script-combo.js"},function(){a()})},
                            "injectAndStartMonitoring":function(){
                                cz.Background.injectAndPerformAction(cz.Background.sendStartMonitoringMessage)},
                            "injectAndAnalyzePageColors":function(){
                                cz.Background.injectAndPerformAction(function(){
                                    cz.Background.sendRequestToSelectedTab({"op":"analyze-page-colors"})})},
                            "prepareMessagesForContentScript":function(){
                                var a=["close_and_stop_picking","collapse_this_panel","expand_this_panel","color_copied_to_clipboard","point_sample","3x3_average","5x5_average","11x11_average","25x25_average","selection_average","select_area_to_sample","sampling"],b={};
                                return a.forEach(function(a){b[a]=chrome.i18n.getMessage(a)}),b},
                            "sendStartMonitoringMessage":function(a){
                                var b=cz.Background.prepareMessagesForContentScript();
                                cz.Background.sendRequestToSelectedTab({"op":"start-monitoring","options":cz.Background.options,"messages":b},a)},
                            "takeScreenshot":function(a){
                                chrome.tabs.captureVisibleTab(null,{"format":"png","quality":100},function(b){
                                    cz.Background.sendRequestToSelectedTab({"op":"screenshot-ready","data":b}),"undefined"!=typeof a&&setTimeout(a,100)})},
                            "onHotKeyPressed":function(a){
                                cz.Background.options.keyboardShortCutsEnabled&&a==cz.Background.options.keyboardShortCutsChar.charCodeAt(0)&&cz.Background.startMonitoring()},
                            "copyColorToClipboard":function(a,b){
                                var c="#"==a.substr(0,1)?cz.czRGBHexaAttributeToCol(a):cz.czRGBAttributeToCol(a),d=cz.czColToSpecificColorFormat(c,b);
                                cz.Background.copyToClipboard(d)},"copyToClipboard":function(a){
                                    var b=document.getElementById("clipboard-copier");b||(b=document.createElement("textarea"),b.id="clipboard-copier",document.body.appendChild(b)),b.value=a,b.select(),document.execCommand("copy",!1,null)},
                            "debugTrace":function(a){
                                cz.Background.options.debugModeOn&&console.log(a)}},
                                cz.ColorHistory={"_historyColors":[],"_maxLength":65,"addColor":function(a){var b;-1!=(b=cz.ColorHistory._historyColors.indexOf(a))&&cz.ColorHistory._historyColors.splice(b,1),cz.ColorHistory._historyColors.unshift(a),cz.ColorHistory._historyColors=cz.ColorHistory._historyColors.slice(0,cz.ColorHistory._maxLength-1),cz.ColorHistory.persist()},"clear":function(){cz.ColorHistory._historyColors=[],cz.ColorHistory.persist()},
                            "get":function(){return cz.ColorHistory._historyColors},
                            "persist":function(){localStorage["color-history"]=JSON.stringify(cz.ColorHistory._historyColors)},
                            "init":function(){"color-history"in localStorage&&(cz.ColorHistory._historyColors=JSON.parse(localStorage["color-history"]))}};
    var debugTrace=cz.Background.debugTrace;cz.ColorHistory.init(),cz.Background.init();