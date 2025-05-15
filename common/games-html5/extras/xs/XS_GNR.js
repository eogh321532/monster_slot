var injectXS_KB = function() {
    var successSubmitIMG = 'data:image/png;base64,' + XS_VARS.success_submit;
    var successSubmitHoverIMG = 'data:image/png;base64,' + XS_VARS.success_submit_hover;
    var successSubmitPressedIMG;
    if (XS_VARS["success_submit_pressed"] != undefined)
        successSubmitPressedIMG = 'data:image/png;base64,' + XS_VARS.success_submit_pressed;
    else
        successSubmitPressedIMG = 'data:image/png;base64,' + XS_VARS.success_submit_hover;

    var xs_type_lowercase = XS_VARS.xs_type.toLowerCase();

    var htmlPayload = `
	<div id="kbContainer">
	  <div id="krFade">
	  </div>
	  <div id="kbWindow">
		 <div id="successWindow">
			<div id="successCloseButton">
			</div>
			<div id="successSubmitButton">
			</div>
			<div id="successCloseText">
			</div>
		 </div>
		 <div id="errorWindow">
			<div id="errorCloseButton">
			</div>
		 </div>
	  </div>
	  <div id="badgeContainer">
		<div id="badge">
		   <div id="badgeCollider">
		   </div>
		   <div id="closeCollider">
		   </div>
		</div>
		<div id="buttonBadge">
		</div>
		<div id="closeButtonBadge">
		</div>
	  </div>
	</div>
	`;

    var styleContent = `
	  #kbContainer
	  {
		 position: absolute;
		 top: 0;
		 left: 0;
		 width: 1444px;
		 height: 999px;
		 -moz-transform-origin: 0 0;
		 -o-transform-origin: 0 0;
		 -webkit-transform-origin: 0 0;
		 -ms-transform-origin: 0 0;
		 transform-origin: 0 0;
		 z-index: 69;
		 pointer-events: none;
	  }

	  #kbWindow
	  {
		 position: absolute;
		 width: 1200px;
		 height: 730px;
		 inset: 0px;
		 margin: auto;
		 margin-top: 80px;
		 border-radius: 15px;
		 color: white;
		 text-align: center;
		 z-index: 72;
	  }

	  #close
	  {
		 color: #BEBEBEFF;
		 font-size: 80px;
		 position: absolute;
		 top: -10px;
		 right: 10px;
	  }
	  #close:hover
	  {
		 color: #8C8C8CFF;
	  }
	  #close:active
	  {
		 color: #8C8C8CFF;
	  }

	  .verifyParagraph
	  {
		 font-size: 30px;
		 font-family: "Futura", serif;
	  }

	  .orange
	  {
		 color: orange;
		 font-family: "Futura", serif;
	  }

	  #badge
	  {
		 position: absolute;
		 width: 235px;
		 height: 299px;
		 right: 56px;
		 bottom: 141px;
		 transform: scale(1);
	  }
	  #badge:hover
	  {
		 transform: scale(1.025);
	  }
	  #badge:active
	  {
		 transform: scale(1);
	  }

	  #buttonBadge
	  {
		 /* background: #00ff0078; */
		 position: absolute;
		 width: 200px;
		 height: 45px;
		 right: 73px;
		 bottom: 143px;
		 pointer-events: all;
	  }

	  #successWindow
	  {
		 margin: auto;
		 margin-top: 100px;
		 width: 850px;
		 height: 530px;
	  }

	  #closeButtonBadge
	  {
		 /* background: #ff000078; */
		 position: absolute;
		 width: 60px;
		 height: 60px;
		 right: 61px;
		 bottom: 378px;
		 pointer-events: all;
	  }

	  #successCloseText
	  {
		 /* background: #00ff0078; */
		 position: relative;
		 width: 70px;
		 height: 35px;
		 margin: auto;
		 margin-top: 385px;
		 pointer-events: none;
	  }

	  #successCloseButton
	  {
		 /* background: #ff000078; */
		 position: absolute;
		 width: 35px;
		 height: 35px;
		 margin-left: 810px;
		 margin-top: 5px;
		 pointer-events: all;
	  }

	  #successSubmitButton
	  {
		 /* background: #ff000078;*/
		 position: relative;
		 width: 318px;
		 height: 53px;
		 margin: auto;
		 top: 375px;
		 pointer-events: all;
		 background-image: url(${successSubmitIMG});
	  }

	  #successSubmitButton:hover
	  {
		 background-image: url(${successSubmitHoverIMG});
	  }

	  #successSubmitButton:active
	  {
		 background-image: url(${successSubmitPressedIMG});
	  }

	  #errorWindow
	  {
		 margin: auto;
		 margin-top: 160px;
		 width: 617px;
		 height: 409px;
	  }

	  #badgeContainer
	  {
		 position: relative;
		 width: 1777px;
		 height: 999px;
		 margin: auto;
		 z-index: 70;
		 pointer-events: none;
	  }

	  #errorCloseButton
	  {
		 /* background: #ff000078; */
		 position: absolute;
		 width: 30px;
		 height: 30px;
		 margin-left: 573px;
		 margin-top: 16px;
		 pointer-events: all;
	  }

	  #filler
	  {
		 width: 100%;
		 height: 69%;
	  }

	  .active
	  {
		 display: block;
	  }
	  .inactive
	  {
		 display: none;
	  }

	  #badgeCollider
	  {
		position: absolute;
		/* background: #00ff0078; */
		border-radius: 50%;
		width: 106%;
		height: 93%;
		left: -4px;
		top: 27px;
		pointer-events: all;
	  }

	  #closeCollider
	  {
		position: absolute;
		/* background: #ff000078; */
		width: 30%;
		height: 23%;
		right: -2px;
		top: -3px;
		pointer-events: all;
	  }
	  
	  #krFade
	  {
		z-index: 71;
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
	  }
	`;

    var lang = window["UHT_GAME_CONFIG"]["LANGUAGE"];
    var kbUIRoot = globalRuntime.sceneRoots[1].GetComponentsInChildren(UIRoot, true)[0];
    var htmlContent = new DOMParser().parseFromString(htmlPayload, "text/html");
    document.body.insertBefore(htmlContent.body.firstChild, renderCanvas);
    var style = document.createElement('style');
    style.textContent = styleContent;
    document.head.appendChild(style);
    document.getElementById("kbWindow").classList.add("inactive");
    document.getElementById("successWindow").classList.add("inactive");
    document.getElementById("errorWindow").classList.add("inactive");

    var successSubmitButtonStyle = successSubmitButton.style;
    var successSubmitButtonStyleY = 0;
    globalTracking.SendEvent("uht_xs_" + xs_type_lowercase, "SeeBadge_" + XS_VARS.xs_type + "_" + lang, 1, "BehaviourTracker");

    var tournamentRanks = globalRuntime.sceneRoots[1].GetComponentsInChildren(TournamentsRank);
    if (Globals.isMobile) {
        if (tournamentRanks) {
            for (i in tournamentRanks) {
                tournamentRanks[i].gameObject.transform.parent.gameObject.SetActive(false);
            }
        }
    }

    var succsessImgLandscape = document.getElementById("successWindow").style.backgroundImage;
    var scalekb = function() {
        if (document.getElementById("successWindow") == undefined)
            return;

        //script = loadScript(path, successCallback, errorCallback);

        var isMobilePortrait = false;
        var isMobileLandscape = false;

        if (Globals.isMobile) {
            var layout = globalRuntime.sceneRoots[1].GetComponentsInChildren(LayoutManager)[0].curMode;

            if (layout == LayoutManager.Mode.Landscape || layout == LayoutManager.Mode.LandscapeWide || layout == LayoutManager.Mode.LandscapeWideFull || layout == LayoutManager.Mode.LandscapeLLN) {
                document.getElementById("successWindow").style.backgroundImage = succsessImgLandscape;
                isMobileLandscape = true;
            } else if (layout != LayoutManager.Mode.Invalid) //portrait
            {
                isMobilePortrait = true;
                document.getElementById("successWindow").style.backgroundImage = "url('data:image/png;base64," + XS_VARS.success_portrait;
            }
        }

        document.getElementById("errorWindow").style.backgroundImage = "url('data:image/png;base64," + XS_VARS.window_err;
        if (!isMobilePortrait)
            document.getElementById("successWindow").style.backgroundImage = "url('data:image/png;base64," + XS_VARS.success_landscape;
        var intendedRatio = kbUIRoot.manualWidth / kbUIRoot.manualHeight;

        var currentRatio = window.innerWidth / window.innerHeight;
        var zoom = 1;
        var styles = ["-moz-transform: scale(VAL)", "-webkit-transform: scale(VAL)", "-ms-transform: scale(VAL)", "-o-transform: scale(VAL)", "transform: scale(VAL)"];
        zoom = Math.min(intendedRatio, currentRatio) / intendedRatio * 2 / kbUIRoot.manualHeight;
        zoom = zoom * window.innerHeight / 2;
        for (var i = 0; i < styles.length; ++i) {
            styles[i] = styles[i].replace("VAL", zoom);
        }
        styles.push("width:" + window.innerWidth / zoom + "px");

        var MCpos = globalRuntime.sceneRoots[1].GetComponentsInChildren(MenuController)[0].transform.localPosition();
        var marginTop = (window.innerHeight - kbUIRoot.manualHeight * zoom) / 2;

        if (Globals.isMobile) {
            if (!isMobilePortrait || (window.innerHeight > window.innerWidth))
                marginTop -= MCpos.y * zoom;

            var marginLeft = window.innerWidth / 2 - MCpos.x * zoom;
            styles.push("margin-left:" + marginLeft + "px");
        }
        styles.push("margin-top:" + marginTop + "px");

        document.getElementById("kbContainer").setAttribute("style", styles.join(";"));

        var badgeStyle = document.getElementById("badge").style;
        var badgeContainerStyle = document.getElementById("badgeContainer").style;

        if (Globals.isMobile) {
            document.getElementById("badge").style.backgroundImage = "url('data:image/png;base64," + XS_VARS.icon_mobile;
            badgeContainerStyle.width = width + "px";
            badgeContainerStyle.marginLeft = "10px";
            document.getElementById("closeButtonBadge").style.transform = "scale(1.7) translateX(-30%)";
            document.getElementById("buttonBadge").classList.remove("active");
            document.getElementById("buttonBadge").classList.add("inactive");
            document.getElementById("closeButtonBadge").classList.remove("active");
            document.getElementById("closeButtonBadge").classList.add("inactive");
            badgeStyle.width = "237px";
            badgeStyle.height = "300px";

            if (isMobilePortrait) {
                badgeStyle.transform = "scale(1.3) translate(11%, 10%)";
            } else {
                badgeStyle.transform = "scale(0.67) translate(-30%, -33%)";
                badgeContainerStyle.transform = "none";
            }

            badgeStyle.right = "";
            badgeStyle.bottom = "";
            badgeStyle.left = "30px";
            badgeStyle.top = "40px";
            //(40 - MCpos.y) + "px";

            document.getElementById("kbContainer").style.height = (kbUIRoot.manualHeight + MCpos.y * 2 + 30) + "px";
            document.getElementById("kbContainer").style.width = (MCpos.x * 2 + 10) + "px";

        } else //desktop
        {
            if (XS_VARS["icon_desktop"] != undefined)
                document.getElementById("badge").style.backgroundImage = "url('data:image/png;base64," + XS_VARS.icon_desktop;
            else
                document.getElementById("badge").style.backgroundImage = "url('data:image/png;base64," + XS_VARS.icon_mobile;

            var width = UHTMath.clamp(window.innerWidth / zoom, 1444, 1777);
            badgeContainerStyle.width = width + "px";

            badgeContainerStyle.transform = "scale(" + (1 - 0.31 * (1777 - width) / 333) + ") translate(" + ((1777 - width) / 333 * 368) + "px, " + ((1777 - width) / 333 * 164) + "px)";
            badgeContainerStyle.marginTop = -Math.sin(Math.PI * (1777 - width) / 333) * 13 + "px";
        }

        var errorWindowStyle = document.getElementById("errorWindow").style;
        var successWindowStyle = document.getElementById("successWindow").style;
        var successCloseButtonStyle = document.getElementById("successCloseButton").style;
        var successSubmitButtonStyle = document.getElementById("successSubmitButton").style;

        if (!isMobilePortrait) {
            errorWindowStyle.marginTop = "";
            errorWindowStyle.transform = "none";

            successWindowStyle.marginTop = "";
            successWindowStyle.transform = "none";
            successWindowStyle.width = "850px"
            successWindowStyle.height = "530px"

            if (XS_VARS["successBtnTopLand"])
                successSubmitButtonStyleY = XS_VARS["successBtnTopLand"];
            else
                successSubmitButtonStyleY = 375;
            successSubmitButtonStyle.transform = "none"

            successCloseButtonStyle.width = "35px";
            successCloseButtonStyle.height = "35px";
            successCloseButtonStyle.marginLeft = "810px";
            successCloseButtonStyle.marginTop = "5px";
        } else {
            errorWindowStyle.marginTop = window.innerHeight + "px";
            errorWindowStyle.transform = "scale(2.2)";

            successWindowStyle.marginTop = kbUIRoot.manualHeight * 0.25 + "px";
            successWindowStyle.transform = "scale(1.5)";
            successWindowStyle.width = "800px"
            successWindowStyle.height = "1134px"

            if (XS_VARS["successBtnTopPort"])
                successSubmitButtonStyleY = XS_VARS["successBtnTopPort"];
            else
                successSubmitButtonStyleY = 800
            successSubmitButtonStyle.transform = "scale(1.5)"

            successCloseButtonStyle.width = "90px";
            successCloseButtonStyle.height = "90px";
            successCloseButtonStyle.marginLeft = "695px";
            successCloseButtonStyle.marginTop = "10px";
        }

        successSubmitButtonStyle.top = successSubmitButtonStyleY + "px";

        if (XS_VARS["hasCloseText"]) {
            var successCloseTextStyle = document.getElementById("successCloseText").style;
            if (!isMobilePortrait) {
                successCloseTextStyle.marginTop = "390px"
                successCloseTextStyle.width = "80px"
                successCloseTextStyle.height = "35px"
                successCloseTextStyle.transform = "none"
            } else {
                successCloseTextStyle.marginTop = "905px"
                successCloseTextStyle.width = "100px"
                successCloseTextStyle.height = "35px"
                successCloseTextStyle.transform = "scale(1.8)"
            }
        }


    }
    scalekb();
    window.addEventListener('resize', function() {
        setTimeout(scalekb, 100)
    }, false);
    var krGameLaunchURL = "";
    var successBtnTested = false;

    var onBadgeClick = function() {
        globalTracking.SendEvent("uht_xs_" + xs_type_lowercase, "ClickBadge_" + XS_VARS.xs_type + "_" + lang, 1, "BehaviourTracker");
        var hasLobby = _bool.Parse(UHT_GAME_CONFIG_SRC["multiProductMiniLobby"]);
        if (hasLobby) {
            var multiLobby = globalRuntime.sceneRoots[1].GetComponentsInChildren(MultiLobbyConnection)[0];
            if (multiLobby.vendors == null)
                return;
            var targetVendor = "";
            for (var i = 0; i < multiLobby.vendors.length; i++) {
                var targetGame;
                if (multiLobby.vendors[i].symbol == "LC") {
                    targetVendor = multiLobby.vendors[i];
                    if (targetVendor != "") {
                        targetGame = targetVendor.games.find((g) => (g.id == XS_VARS.id || (g.id.indexOf(XS_VARS.id + "a") == 0)));
                    }
                } else if (multiLobby.vendors[i].symbol == "SLOTS") {
                    targetVendor = multiLobby.vendors[i];
                    if (targetVendor != "") {
                        targetGame = targetVendor.games.find((g) => (g.symbol == XS_VARS.id));
                    }
                }

                if (targetGame != undefined) {
                    krGameLaunchURL = targetGame.launchURL + "&launchSource=slots";
                    break;
                }
            }
        }
        document.getElementById("kbWindow").classList.remove("inactive");
        document.getElementById("kbWindow").classList.add("active");
        if (krGameLaunchURL != "")
            var showSuccess = krGameLaunchURL != "";
        if (location.hostname.indexOf(".gp16.") != -1) {
            if (!successBtnTested)
                showSuccess = true;
            else
                successBtnTested = false;
            //so it works again next time I click;
        }

        if (showSuccess) {
            successBtnTested = true;
            document.getElementById("successWindow").classList.remove("inactive");
            document.getElementById("successWindow").classList.add("active");

            document.getElementById("kbContainer").style.pointerEvents = "all";
            document.getElementById("krFade").style.backgroundColor = "#00000080";
            document.getElementById("successCloseButton").style.pointerEvents = "all";
            document.getElementById("successSubmitButton").style.pointerEvents = "all";
            if (XS_VARS["hasCloseText"])
                document.getElementById("successCloseText").style.pointerEvents = "all";
            document.getElementById("buttonBadge").style.pointerEvents = "none";
            document.getElementById("badgeCollider").style.pointerEvents = "none";
            document.getElementById("closeCollider").style.pointerEvents = "none";
            document.getElementById("closeButtonBadge").style.pointerEvents = "none";
        } else {
            document.getElementById("errorWindow").classList.remove("inactive");
            document.getElementById("errorWindow").classList.add("active");

            document.getElementById("kbContainer").style.pointerEvents = "all";
            document.getElementById("krFade").style.backgroundColor = "#00000080";
            document.getElementById("errorCloseButton").style.pointerEvents = "all";
            document.getElementById("buttonBadge").style.pointerEvents = "none";
            document.getElementById("badgeCollider").style.pointerEvents = "none";
            document.getElementById("closeCollider").style.pointerEvents = "none";
            document.getElementById("closeButtonBadge").style.pointerEvents = "none";
            if (!hasLobby) {
                globalTracking.SendEvent("uht_xs_" + xs_type_lowercase, "ErrorNoLobby_" + XS_VARS.xs_type + "_" + lang, 1, "BehaviourTracker");
            } else {
                globalTracking.SendEvent("uht_xs_" + xs_type_lowercase, "ErrorGameNotFound_" + XS_VARS.xs_type + "_" + lang, 1, "BehaviourTracker");
            }
        }
    }
    document.getElementById("buttonBadge").addEventListener("click", onBadgeClick, false);
    document.getElementById("badgeCollider").addEventListener("click", onBadgeClick, false);

    var onSuccesCloseButtonClick = function() {
        document.getElementById("kbWindow").classList.remove("active");
        document.getElementById("kbWindow").classList.add("inactive");
        document.getElementById("successWindow").classList.remove("active");
        document.getElementById("successWindow").classList.add("inactive");

        document.getElementById("kbContainer").style.pointerEvents = "none";
        document.getElementById("krFade").style.backgroundColor = "#00000000";
        document.getElementById("buttonBadge").style.pointerEvents = "all";
        document.getElementById("badgeCollider").style.pointerEvents = "all";
        document.getElementById("closeCollider").style.pointerEvents = "all";
        document.getElementById("closeButtonBadge").style.pointerEvents = "all";
        globalTracking.SendEvent("uht_xs_" + xs_type_lowercase, "LaunchWindowClose_" + XS_VARS.xs_type + "_" + lang, 1, "BehaviourTracker");
    }
    document.getElementById("successCloseButton").addEventListener("click", onSuccesCloseButtonClick, false);
    if (XS_VARS["hasCloseText"])
        document.getElementById("successCloseText").addEventListener("click", onSuccesCloseButtonClick, false);

    var onErrorCloseButtonClick = function() {
        document.getElementById("kbWindow").classList.remove("active");
        document.getElementById("kbWindow").classList.add("inactive");
        document.getElementById("errorWindow").classList.remove("active");
        document.getElementById("errorWindow").classList.add("inactive");

        document.getElementById("kbContainer").style.pointerEvents = "none";
        document.getElementById("krFade").style.backgroundColor = "#00000000";
        document.getElementById("buttonBadge").style.pointerEvents = "all";
        document.getElementById("badgeCollider").style.pointerEvents = "all";
        document.getElementById("closeCollider").style.pointerEvents = "all";
        document.getElementById("closeButtonBadge").style.pointerEvents = "all";
    }

    document.getElementById("errorCloseButton").addEventListener("click", onErrorCloseButtonClick, false);
    var onCloseBadge = function() {
        var container = document.getElementById("kbContainer");
        if (container)
            container.remove();

        window.removeEventListener('resize', scalekb, false);
        if (tournamentRanks) {
            for (i in tournamentRanks) {
                tournamentRanks[i].gameObject.transform.parent.gameObject.SetActive(true);
            }
        }
        globalTracking.SendEvent("uht_xs_" + xs_type_lowercase, "CloseBadge_" + XS_VARS.xs_type + "_" + lang, 1, "BehaviourTracker");
    }

    document.getElementById("closeButtonBadge").addEventListener("click", onCloseBadge, false);
    document.getElementById("closeCollider").addEventListener("click", onCloseBadge, false);

    var onSuccessSubmitButton = function() {
        if (XS_VARS["success_submit_pressed"] == undefined) {
            var newY = parseInt(successSubmitButtonStyleY) + 2;
            successSubmitButtonStyle.top = newY + "px";
        }

        document.getElementById("kbContainer").style.pointerEvents = "none";
        document.getElementById("buttonBadge").style.pointerEvents = "all";
        document.getElementById("badgeCollider").style.pointerEvents = "all";
        document.getElementById("closeCollider").style.pointerEvents = "all";
        document.getElementById("closeButtonBadge").style.pointerEvents = "all";
        globalTracking.SendEvent("uht_xs_" + xs_type_lowercase, "LaunchWindowPlay_" + XS_VARS.xs_type + "_" + lang, 1, "BehaviourTracker");
        location.assign(krGameLaunchURL);
    }
    document.getElementById("successSubmitButton").addEventListener("click", onSuccessSubmitButton, false);
}