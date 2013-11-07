ig.module(
	'game.entities.topzombie'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityTopzombie = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/zombieTopSheet.png', 16, 16),
		size: {x:8, y:14},
		offset: {x:4, y:2},
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		//physics
		maxVel: {x: 50, y: 50},
        friction: {x: 150, y: 150},
        accelGround: 100,
        direction: 3,
        speed: 12,
		
		init: function(x,y, settings){
			this.parent(x,y,settings);
			this.setupAnimation(this.direction);
		},
		
		setupAnimation: function(offset){
            
			this.addAnim('up',.4, [3]);
			this.addAnim('down',.4, [0]);
			this.addAnim('left',.4, [1]);
			this.addAnim('right',.4, [2]);
        },
		
		update: function(){
			this.parent();
			
			//Move logic
			//If walking and encounter a collision tile just increase the direction. 
			//Which will cause the zombie to walk a different way.
            if(this.direction == 0){
            	this.vel.y = this.speed;
            	this.currentAnim = this.anims.down;
            }else if (this.direction == 1){
            	this.vel.x = -this.speed;
            	this.currentAnim = this.anims.left;
            }else if (this.direction == 2){
            	this.vel.x = this.speed;
            	this.currentAnim = this.anims.right;
            }else if (this.direction == 3){
            	this.vel.y = -this.speed;
            	this.currentAnim = this.anims.up;
            }
            
            this.parent();
        },
        
        handleMovementTrace: function( res ) {
    		this.parent( res );
    		// collision with a wall? return!
    		if( res.collision.x || res.collision.y) {
    			this.direction++;
    			this.direction = this.direction % 4;
    		}
    	},
        
        check: function( other ) {
    		other.receiveDamage( 10, this );
    	},
    	
    	kill: function(){
    		ig.game.stats.kills++;
        	this.parent();
    	},
    	
	});
});