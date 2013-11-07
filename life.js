ig.module(
	'game.entities.life'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityLife = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/life.png',16, 16),
		size: {x:8, y:8},
		offset: {x:4, y:4},
		flip: false,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		init: function(x,y, settings){
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
		},
		
		check: function(other){
			this.kill();
			ig.game.lives = ig.game.lives + 1;
		},
		
		update: function(){
			this.parent();
		}
    	
	});
});