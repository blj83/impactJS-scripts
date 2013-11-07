ig.module(
	'game.entities.assault'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityAssault = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/assault.png', 16, 8),
		size: {x:12, y:6},
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
			if (ig.game.assault == false){
				ig.game.assault = true;
			}
			else{
				ig.game.aBullets += 50;
			}
		},
		
		update: function(){
			this.parent();
		}
    	
	});
});