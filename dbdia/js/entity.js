dbdia.Entity = function(ctx, coords){
    this.ctx = ctx;
    this.x = coords.x;
    this.y = coords.y;
    this.w = 150;
    this.h = 200;
    this._selected = false;
    this._constraints = [];
}

dbdia.Entity.prototype.draw = function(){
    if(this._selected){
        this.ctx.fillStyle   = '#F00';
    }else{
        this.ctx.fillStyle   = '#00F';
    }
    this.clearArea();
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillRect(this.x+1,this.y+1,this.w-2, this.h-2);
    this.drawConstraints();
}

dbdia.Entity.prototype.drawConstraints = function(){
    var i;
    for(i=0; i<this._constraints.length; i++){
        var entity = this._constraints[i].entity;
        if(entity.y > this.y+this.h || this.y > entity.y+entity.h){
            var upperEntity = entity.y > this.y+this.h? this : entity;
            var lowerEntity = entity.y > this.y+this.h? entity : this;
            var bottom = upperEntity.y+upperEntity.h;
            this.ctx.beginPath();
            this.ctx.moveTo(upperEntity.x+upperEntity.w/2, bottom);
            this.ctx.lineTo(upperEntity.x+upperEntity.w/2, bottom+((lowerEntity.y-bottom)/2));
            this.ctx.lineTo(lowerEntity.x + lowerEntity.w/2, bottom+((lowerEntity.y-bottom)/2));
            this.ctx.lineTo(lowerEntity.x + lowerEntity.w/2, lowerEntity.y);
            this.ctx.stroke();
            this.ctx.closePath();
        }else if(entity.x > this.x+this.w || this.x > entity.x+entity.w){
            var leftmost, rightmost;
            if(entity.x > this.x+this.w){
                leftmost = this;
                rightmost = entity;
            }else{
                leftmost = entity;
                rightmost = this;
            }
            this.ctx.beginPath();
            var startPoint = {'x': leftmost.x+leftmost.w, 'y': leftmost.y+leftmost.h/2 };
            var endPoint = {'x': rightmost.x, 'y': rightmost.y+rightmost.h/2};
            var middlePoint = {
                'x': endPoint.x-((endPoint.x-startPoint.x)/2)
            };
            this.ctx.moveTo(startPoint.x+0.5, startPoint.y+0.5);
            this.ctx.lineTo(middlePoint.x+0.5, startPoint.y+0.5);
            this.ctx.lineTo(middlePoint.x+0.5, endPoint.y+0.5);
            this.ctx.lineTo(endPoint.x+0.5, endPoint.y+0.5);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
}

dbdia.Entity.prototype.addConstraint = function(constraint){
    this._constraints.push(constraint);
}

dbdia.Entity.prototype.clearArea = function(){
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
}

dbdia.Entity.prototype.contains = function(coords){
    return coords.x >= this.x && coords.x <= this.x+this.w
        && coords.y >= this.y && coords.y <= this.y+this.h;
}

dbdia.Entity.prototype.setPosition = function(coords){
    this.x = coords.x;
    this.y = coords.y;
}

dbdia.Entity.prototype.select = function(){
    this._selected = true;
}

dbdia.Entity.prototype.unselect = function(){
    this._selected = false;
}
