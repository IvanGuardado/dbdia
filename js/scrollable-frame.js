dbdia.ScrollableFrame = function(options){
    this._canvasId = options.canvasId;
    this._entities = [];
    this._$el = null;
    this._$wrapper = null;
    this._ctx = null;
    this._selectedEntity = null;
    this._draggingInfo = null;
    
    this.initialize();
    
    //demo
    var entity2 = new dbdia.Entity(this._ctx, {
        name: 'pedido',
        coords: {x: 200, y: 150},
    });
    
    var entity3 = new dbdia.Entity(this._ctx, {
        name: 'producto',
        coords: {x: 500, y: 400},
    });
    
    var entity = new dbdia.Entity(this._ctx, {
        name: 'producto_pedido',
        coords: {x: 500, y: 100},
        constraints: [entity2, entity3]
    });
    
    this.addEntity(entity);
    this.addEntity(entity2);
    this.addEntity(entity3);
}

dbdia.ScrollableFrame.prototype.initialize = function(){
    this._$el = $('#'+this._canvasId)
    this._ctx = this._$el.get(0).getContext('2d');
    this.resize();
    this.wrapCanvas();
    this.loadEvents();
    this.startRefreshLoop();
}

dbdia.ScrollableFrame.prototype.wrapCanvas = function(){
    var $div = $('<div id="'+this._canvasId+'-wrapper" />');
    this._$el.wrap($div);
    this._$wrapper = $('#'+this._canvasId+'-wrapper');
    this._$wrapper.width(this._$el.width());
    this._$wrapper.height(this._$el.height());
}

dbdia.ScrollableFrame.prototype.resize = function(){
    var $window = $(window);
    this._$el
        .attr('width', $window.width())
        .attr('height', $window.height());
}

dbdia.ScrollableFrame.prototype.loadEvents = function(){
    var me = this;
    this._$el.mousedown(function(ev){
        me._draggingInfo = {
            startPoint:  {x: ev.offsetX, y: ev.offsetY}
        }
        me.unselectEntity();
    }).mouseup(function(ev){
        me.selectEntity({x: ev.offsetX, y: ev.offsetY});
        me.checkFrameBounds();
        me._draggingInfo = null;
    }).mousemove(function(ev){
        if(me._draggingInfo !== null){
            if(me._selectedEntity === null){
                me.selectEntity(me._draggingInfo.startPoint);
            }
            if(me._selectedEntity !== null){
                var coords = {x: ev.offsetX+me._draggingInfo.offset.x, y: ev.offsetY+me._draggingInfo.offset.y};
                me._draggingInfo.startPoint = coords;
                me._selectedEntity.setPosition(coords);
            }
        }
    });
}

dbdia.ScrollableFrame.prototype.checkFrameBounds = function(){
    if(this._selectedEntity){
        var right = (this._selectedEntity.x + this._selectedEntity.w) - this._$el.width();
        if(right > 0){
            this._$el.attr('width', this._$el.width() + right);
            this._$wrapper.scrollLeft(this._$el.width());
        }else if(this._selectedEntity.x < 0){
            var left = this._selectedEntity.x*-1;
            this._$el.attr('width', this._$el.width() + left);
            this._entities.map(function(entity){
                entity.x += left;
            });
        }
        
        var bottom = (this._selectedEntity.y + this._selectedEntity.h) - this._$el.height();
        if(bottom > 0){
            this._$el.attr('height', this._$el.height() + bottom);
            this._$wrapper.scrollTop(this._$el.height());
        }
        else if(this._selectedEntity.y < 0){
            var top = this._selectedEntity.y*-1;
            this._$el.attr('height', this._$el.height() + top);
            this._entities.map(function(entity){
                entity.y += top;
            });
        }
    }
}

dbdia.ScrollableFrame.prototype.selectEntity = function(coords){
    var match = this.findEntityByCoords(coords);
    if(match !== null){
        this.bringToFront(match.position);
        this.unselectEntity();
        this._selectedEntity = match.entity;
        this._selectedEntity.select();
        this._draggingInfo.offset = {
            x: this._selectedEntity.x - coords.x,
            y: this._selectedEntity.y - coords.y
        }
    }else{
        if(this._selectedEntity !== null){
             this.unselectEntity();
        }
    }
}

dbdia.ScrollableFrame.prototype.unselectEntity = function(){
    if(this._selectedEntity){
        this._selectedEntity.unselect();
        this._selectedEntity = null;
    }
}

dbdia.ScrollableFrame.prototype.bringToFront = function(index){
    var entity = this._entities.splice(index,1)[0];
    this._entities.push(entity);
}

dbdia.ScrollableFrame.prototype.findEntityByCoords = function(coords){
    var i,
        entity;
    for(i=this._entities.length-1; i>=0; i--){
        entity = this._entities[i];
        if(entity.contains(coords)){
            return {"entity": entity, "position": i};
        }
    }
    return null;
}

dbdia.ScrollableFrame.prototype.addEntity = function(entity){
    this._entities.push(entity);
    this.draw();
}

dbdia.ScrollableFrame.prototype.draw = function(){
    var i;
    /* Draw constraints before entities to keep behind it */
    for(i=0; i<this._entities.length; i++){
        this._entities[i].drawConstraints();
    }
    
    for(i=0; i<this._entities.length; i++){
        this._entities[i].draw(this._ctx);
    }
}

dbdia.ScrollableFrame.prototype.clear = function(){
    this._ctx.clearRect(0,0,this._$el.width(), this._$el.height());
}

dbdia.ScrollableFrame.prototype.startRefreshLoop = function(){
    var me = this;
    /**
    * Provides requestAnimationFrame in a cross browser way.
    * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    */
   if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = ( function() {
            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element ) {
              window.setTimeout( callback, 1000 / 60 );
            };
     } )();
    }
   
    requestAnimationFrame(loop);
    
    function loop(ev){
        me.clear();
        me.draw();
        requestAnimationFrame(loop);
    }
   
}


