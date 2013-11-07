ig.module(
	'game.entities.death'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityDeath = ig.Entity.extend({
		size: {x:64, y:8},
		_wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.ACTIVE,
		
		init: function(x,y, settings){
			this.parent(x,y,settings);
		},
		
		update: function(){
			
		},
		check: function( other ) {
        	other.receiveDamage( 10, this );
        }
    	
	});
});