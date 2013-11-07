ig.module(
	'game.entities.gun'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityGun = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/gun.png', 10, 6),
		size: {x:10, y:6},
		offset: {x:2, y:2},
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
			ig.game.gun = true;
		},
		
		update: function(){
			this.parent();
		}
    	
	});
});