dbdia.utils = {
    roundRect: function(ctx, x, y, width, height, radius, type) {
        if (typeof stroke == "undefined" ) {
          stroke = true;
        }
        if (typeof radius === "undefined") {
          radius = 5;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (type === 'stroke') {
          ctx.stroke();
        }else{
          ctx.fill();
        }
    }
}