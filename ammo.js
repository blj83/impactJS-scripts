ig.module(
	'game.entities.ammo'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityAmmo = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/ammo.png', 5, 5),
		size: {x:5, y:5},
		offset: {x:0, y:0},
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
			ig.game.bullets = ig.game.bullets + 25;
		},
		
		update: function(){
			this.parent();
		}
    	
	});
});