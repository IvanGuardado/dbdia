dbdia.Entity = function(ctx, values){
    this.ctx = ctx;
    this.x = values.coords? values.coords.x : 0;
    this.y = values.coords? values.coords.y : 0;
    this.w = 150;
    this.h = 200;
    this.name = values.name || '';
    this._headerHeight = 23;
    this._footerHeight = 9;
    this._selected = false;
    this._constraints = values.constraints || [];
}

dbdia.Entity.prototype.draw = function(){
    
    this.clearArea();
    if(this._selected){
        this._drawBorder();
    }
    this._drawBody();
    this._drawHeader();
    this._drawFooter();
    if(this._selected){
        this._drawResizers();
    }
}

dbdia.Entity.prototype._drawBorder = function(){
    this.ctx.save();
    this.ctx.strokeStyle = "#99d9f3";
    dbdia.utils.roundRect(this.ctx, this.x-1, this.y-1, this.w+2, this.h+2, 5, 'stroke');
    this.ctx.strokeStyle = "#bde7f7";
    dbdia.utils.roundRect(this.ctx, this.x-2, this.y-2, this.w+4, this.h+4, 5, 'stroke');
    this.ctx.strokeStyle = "#e1f4fb";
    dbdia.utils.roundRect(this.ctx, this.x-3, this.y-3, this.w+6, this.h+6, 5, 'stroke');
    this.ctx.strokeStyle = "#f0fafd";
    dbdia.utils.roundRect(this.ctx, this.x-4, this.y-4, this.w+8, this.h+8, 5, 'stroke');
    this.ctx.restore();
}

dbdia.Entity.prototype._drawHeader = function(){
    var radius = 5;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.x-0.5 + radius, this.y);
    this.ctx.lineTo(this.x + this.w - radius, this.y);
    this.ctx.quadraticCurveTo(this.x + this.w-0.5, this.y, this.x + this.w+0.5, this.y + radius);
    this.ctx.lineTo(this.x + this.w+0.5, this.y + this._headerHeight);
    this.ctx.lineTo(this.x-0.5, this.y + this._headerHeight);
    this.ctx.lineTo(this.x-0.5, this.y + radius);
    this.ctx.quadraticCurveTo(this.x-0.5, this.y, this.x + radius, this.y);
    this.ctx.fillStyle = '#98bfda'
    this.ctx.strokeStyle = '#b3b3b3';
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.fillStyle = '#000';
    this.ctx.font = "bold 10pt Arial";
    this.ctx.fillText(this.name, this.x+10, this.y+15);  
    this.ctx.restore();
}

dbdia.Entity.prototype._drawFooter = function(){
    var radius = 5,
        x = this.x-0.5,
        y = this.y+this.h-this._footerHeight;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(this.x + this.w + 0.5, y);
    this.ctx.lineTo(this.x + this.w + 0.5, y + this._footerHeight - radius);
    this.ctx.quadraticCurveTo(this.x + this.w, y + this._footerHeight, this.x + this.w - radius, y + this._footerHeight);
    this.ctx.lineTo(this.x + radius, y+this._footerHeight);
    this.ctx.quadraticCurveTo(this.x, y + this._footerHeight, this.x-0.5, y+radius);
    this.ctx.lineTo(this.x-0.5, y);
    this.ctx.fillStyle = '#98bfda'
    this.ctx.strokeStyle = '#b3b3b3';
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
}

dbdia.Entity.prototype._drawBody = function(){
    this.ctx.save();
    this.ctx.strokeStyle = '#808080';
    this.ctx.strokeRect(this.x, this.y+this._headerHeight, this.w, this.h-this._headerHeight-this._footerHeight);    
    this.ctx.restore();
}

dbdia.Entity.prototype._drawResizers = function(){
    var middleX = this.x+(this.w/2)-4.5;
    var middleY = this.y+(this.h/2)-4.5;
    var bottom = this.y+this.h-4.5;
    var left = this.x-4.5;
    var right = this.x+this.w-4.5;
    this.ctx.save();
    this.ctx.strokStyle = '#000';
    this.ctx.fillStyle = '#fff';
    //left-top
    this.ctx.fillRect(left, this.y-4.5, 9, 9);
    this.ctx.strokeRect(left, this.y-4.5, 9, 9);
    //middle-top
    this.ctx.fillRect(middleX, this.y-4.5, 9, 9);
    this.ctx.strokeRect(middleX, this.y-4.5, 9, 9);
    //right-top
    this.ctx.fillRect(right, this.y-4.5, 9, 9);
    this.ctx.strokeRect(right, this.y-4.5, 9, 9);
    //left-middle
    this.ctx.fillRect(left, middleY, 9, 9);
    this.ctx.strokeRect(left, middleY, 9, 9);
    //left-right
    this.ctx.fillRect(right, middleY, 9, 9);
    this.ctx.strokeRect(right, middleY, 9, 9);
    //bottom-left
    this.ctx.fillRect(left, bottom, 9, 9);
    this.ctx.strokeRect(left, bottom, 9, 9);
    //bottom-middle
    this.ctx.fillRect(middleX, bottom, 9, 9);
    this.ctx.strokeRect(middleX, bottom, 9, 9);
    //bottom-right
    this.ctx.fillRect(right, bottom, 9, 9);
    this.ctx.strokeRect(right, bottom, 9, 9);
    
    this.ctx.restore();
}

dbdia.Entity.prototype.drawConstraints = function(){
    var i, upperEntity, lowerEntity, leftmost, rightmost, startPoint, endPoint, middlePoint;
    this.ctx.save();
    this.ctx.strokeStyle = '#bcbcbc';
    for(i=0; i<this._constraints.length; i++){
        var entity = this._constraints[i];
        if(entity.y > this.y+this.h || this.y > entity.y+entity.h){
            
            
            if(entity.y > this.y+this.h){
                upperEntity = this;
                lowerEntity = entity;
            }else{
                upperEntity = entity;
                lowerEntity = this;
            }
            
            startPoint = {'x': upperEntity.x+upperEntity.w/2, 'y': upperEntity.y+upperEntity.h };
            endPoint = {'x': lowerEntity.x+lowerEntity.w/2, 'y': lowerEntity.y};
            middlePoint = {
                'x': startPoint.x,
                'y': endPoint.y-((endPoint.y-startPoint.y)/2)
            };
            this.ctx.beginPath();
            this.ctx.moveTo(startPoint.x+0.5, startPoint.y+0.5);
            this.ctx.lineTo(middlePoint.x+0.5, middlePoint.y+0.5);
            this.ctx.lineTo(endPoint.x+0.5, middlePoint.y+0.5);
            this.ctx.lineTo(endPoint.x+0.5, endPoint.y+0.5);
            this.ctx.stroke();
            this.ctx.closePath();
        
        }else if(entity.x > this.x+this.w || this.x > entity.x+entity.w){
            if(entity.x > this.x+this.w){
                leftmost = this;
                rightmost = entity;
            }else{
                leftmost = entity;
                rightmost = this;
            }
            this.ctx.beginPath();
            startPoint = {'x': leftmost.x+leftmost.w, 'y': leftmost.y+leftmost.h/2 };
            endPoint = {'x': rightmost.x, 'y': rightmost.y+rightmost.h/2};
            middlePoint = {
                'x': endPoint.x-((endPoint.x-startPoint.x)/2),
                'y': startPoint.y
            };
            this.ctx.moveTo(startPoint.x+0.5, startPoint.y+0.5);
            this.ctx.lineTo(middlePoint.x+0.5, middlePoint.y+0.5);
            this.ctx.lineTo(middlePoint.x+0.5, endPoint.y+0.5);
            this.ctx.lineTo(endPoint.x+0.5, endPoint.y+0.5);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
    this.ctx.restore();
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
