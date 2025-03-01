/*
  Initialises the website as needed for this app (GUI and JS changes)
  Good practice:
    - We should always try to touch the js as little as possible (add code instead of overriding) not to break anything should there be minor changes to the website
    - There are many Snapdrop forks with minor tweaks, so put every independent code part into a try-catch
*/

//change ReceiveTextDialog._onCopy to connect to JavaScriptInterface (don't call super method as it will throw an NotAllowedError)
try {
    ReceiveTextDialog.prototype._onCopy = function(){
        SnapdropAndroid.copyToClipboard(this.$text.textContent);
        Events.fire('notify-user', 'Copied to clipboard');
    };
} catch (e) {
    console.error(e);
}

//change PeerUI.setProgress(progress) to connect to JavaScriptInterface
try {
    PeerUI.prototype.sP = PeerUI.prototype.setProgress;
    PeerUI.prototype.setProgress = function(progress){
        SnapdropAndroid.setProgress(progress);
        this.sP(progress);
     };
} catch (e) {
    console.error(e);
}

//change tweet link
try {
    document.querySelector('.icon-button[title~="Tweet"]').href = 'https://twitter.com/intent/tweet?text=@SnapdropAndroid%20-%20%22Snapdrop%20for%20Android%22%20is%20an%20Android%20client%20for%20%23snapdrop%0A%0Ahttps://snapdrop.net';
} catch (e) {
    console.error(e);
}

//add footer to about page
try {
    let websiteLinkDiv = document.createElement('div');
    websiteLinkDiv.style.cssText = 'height:10%; position:absolute; bottom:0px;';

    let websiteLink = document.createElement('a');
    websiteLink.href = 'https://snapdrop.net/';
    websiteLink.target = '_blank';

    let websiteLinkText = document.createElement('h4');
    websiteLinkText.style.cssText = 'font-size: 16px; font-weight: 400; letter-spacing: .5em; margin: 16px 0;';
    websiteLinkText.innerText = 'WWW.SNAPDROP.NET';

    let aboutScreen = document.querySelector('#about>section');
    websiteLinkDiv.appendChild(websiteLink);
    websiteLink.appendChild(websiteLinkText);
    aboutScreen.appendChild(websiteLinkDiv);
} catch (e) {
    console.error(e);
}


//retarget donation button (play guidelines)
try {
    document.querySelector('.icon-button[href*="paypal"]').href = 'https://github.com/fm-sys/snapdrop-android/blob/master/FUNDING.md';
} catch (e) {
    console.error(e);
}

//remove "safari hack"
try {
    document.body.onclick = null;
} catch (e) {
    console.error(e);
}

//avoid text overflow (receive dialog) - might not be necessary anymore (see #393)
try {
    document.getElementById('fileName').style.textOverflow='ellipsis';
    document.getElementById('fileName').style.overflow='hidden';
} catch (e) {
    console.error(e);
}

//move about background to the left side (for better opening animation)
try {
    let aboutBackground = document.querySelector('#about>x-background');
    aboutBackground.style.left = 'calc(32px - 200px)';
    aboutBackground.style.right = null;
} catch (e) {
    console.error(e);
}

//change PeerUI._onTouchEnd(e) to connect to JavaScriptInterface
try {
    PeerUI.prototype._oTE = PeerUI.prototype._onTouchEnd;
    PeerUI.prototype._onTouchEnd = function(e){
        this._oTE(e);
        if ((Date.now() - this._touchStart < 500) && SnapdropAndroid.shouldOpenSendTextDialog()) {
            Events.fire('text-recipient', this._peer.id);
        }
    };
} catch (e) {
    console.error(e);
}

//catch chunks
try {
    Peer.prototype._oFH = Peer.prototype._onFileHeader;
    Peer.prototype._onFileHeader = function(header){
        SnapdropAndroid.newFile(header.name,header.mime, header.size);
        this._oFH(header);
    };

    Peer.prototype._oCR = Peer.prototype._onChunkReceived;
    Peer.prototype._onChunkReceived = function(chunk){
        let decoder = new TextDecoder('iso-8859-1');
        SnapdropAndroid.onBytes(decoder.decode(chunk));
        this._oCR(chunk);
    };
} catch (e) {
    console.error(e);
}

//detect dialogs
try {
    Dialog.prototype._shw = Dialog.prototype.show;
    Dialog.prototype.show = function(){
        SnapdropAndroid.dialogShown();
        this._shw();
    };

    Dialog.prototype._hde = Dialog.prototype.hide;
    Dialog.prototype.hide = function(){
        SnapdropAndroid.dialogHidden();
        this._hde();
    };
} catch (e) {
    console.error(e);
}

//show localized display name
try {
    let localizeDisplayName = function(str){
        document.getElementById('displayName').textContent = SnapdropAndroid.getYouAreKnownAsTranslationString(str);
    };

    window.addEventListener('display-name', e => window.setTimeout(_ => localizeDisplayName(e.detail.message.displayName), 100), false);

    let currentText = document.getElementById('displayName').textContent;
    if(currentText.startsWith("You are known as ")){
        localizeDisplayName(currentText.split("You are known as ")[1]);
    }
} catch (e) {
    console.error(e);
}

window.addEventListener('file-received', e => {
    SnapdropAndroid.saveDownloadFileName(e.detail.name, e.detail.size);
}, false);
