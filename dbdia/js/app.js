var dbdia = dbdia || {};
$(function(){
    dbdia.App = function(){};
    dbdia.App.prototype.start = function(){
        this.scrollableFrame = new dbdia.ScrollableFrame({
            canvasId: 'scrollable-frame'
        });
    }
    
    window.myApp = new dbdia.App();
    window.myApp.start();
});