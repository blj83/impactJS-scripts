ig.module(
	'game.entities.zombie'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityZombie = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/myZombieSheet.png', 16, 16 ),
    size: {x: 8, y:14},
    offset: {x: 4, y: 2},
    maxVel: {x: 100, y: 100},
    flip: false,
    friction: {x: 150, y: 0},
    speed: 12,
    count: 0,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function( x, y, settings ) {
    	this.parent( x, y, settings );
    	if (ig.game.level == 'Myers'){
    		this.flip = true;
    	}else if (ig.game.level == 'Room2'){
    		if (this.x > 184){
    			this.flip = true;
    		}
    	}else if (ig.game.level == 'Room3'){
    		this.speed = 20;
    	}
    	this.addAnim('walk', .12, [0,1,2,3,4]);
    },
    update: function() {
    	// near an edge? return!
    	if( !ig.game.collisionMap.getTile(
    		this.pos.x + (this.flip ? +4 : this.size.x -4),
    			this.pos.y + this.size.y+1
    		)
    	) {
    		this.flip = !this.flip;
    	}
    	var xdir = this.flip ? -1 : 1;
    	this.vel.x = this.speed * xdir;
    	this.currentAnim.flip.x = this.flip;
    	//spawn zombie
    	if(ig.game.level == 'Myers' && Math.round(ig.game.spawnTimer.delta()) == 5){
    		ig.game.spawnEntity( EntityZombie, 356, 110, {flip:true} );
    		ig.game.spawnTimer.reset();
    	}
    	if(ig.game.level == 'Room4' && Math.round(ig.game.spawnTimer.delta()) == 12){
    		ig.game.spawnEntity( EntityZombie, 380, 108, {flip:false} );
    		ig.game.spawnTimer.reset();
    	}
    	this.parent();
    },
    handleMovementTrace: function( res ) {
    	this.parent( res );
    	// collision with a wall? return!
    	if( res.collision.x ) {
    		this.flip = !this.flip;
    	}
    },
    check: function( other ) {
    	other.receiveDamage( 10, this );
    },
    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
    		ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 1});
    },
    kill: function(){
    	ig.game.stats.kills ++;
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
    }
});
});
