ig.module(
	'game.entities.spot'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntitySpot = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/spotSheet.png', 16, 16),
		size: {x:8, y:14},
		offset: {x:4, y:2},
		flip: false,
		found: false,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		init: function(x,y, settings){
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
		},
		
		check: function(other){
			this.kill();
			if(ig.game.level == 'Forest')
				ig.game.found = true; 
			ig.game.goal--;	
		},
		
		update: function(){
			this.parent();
		}
    	
	});
});