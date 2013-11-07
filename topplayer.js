ig.module(
	'game.entities.topplayer'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityTopplayer = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/TopMainSheet.png', 16, 16),
		size: {x:10, y:10},
		offset: {x:4, y:2},
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		//physics
		maxVel: {x: 30, y: 30},
        friction: {x: 500, y: 500},
        accelGround: 100,
        direction: 3,
        
        //respawn
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer:null,
        
        //sound
        shootSFX: new ig.Sound( 'media/sounds/shoot.*' ),
        deathSFX: new ig.Sound( 'media/sounds/death.*' ),
        
        instructText: new ig.Font( 'media/04b03.font.png' ),
		
		init: function(x,y, settings){
			this.parent(x,y,settings);
			this.setupAnimation(this.direction);
			this.startPosition = {x:x,y:y};
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
            ig.game.gravity = 0;
		},
		
		setupAnimation: function(offset){
            
            if(offset == 3)
				this.addAnim('idle', 1, [9]);
			else if(offset == 2)
				this.addAnim('idle', 1, [6]);
			else if(offset == 0)
				this.addAnim('idle', 1, [0]);
			else if(offset == 1)
				this.addAnim('idle', 1, [3]);
				
			this.addAnim('up',.4, [9,10,11]);
			this.addAnim('down',.4, [0,1,2]);
			this.addAnim('left',.4, [3,4,5]);
			this.addAnim('right',.4, [6,7,8]);
        },
		
		makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        },
		
		update: function(){
			this.parent();
			
			if( ig.input.state('left') ) {
        		this.accel.x = -this.accelGround;
        		this.accel.y = 0;
        		this.direction = 1;
        		this.vel.y = 0;
        	}else if( ig.input.state('right') ) {
        		this.accel.x = this.accelGround;
        		this.direction = 2;
        		this.accel.y = 0;
        		this.vel.y = 0;
        	}else if (ig.input.state('jump')){
        		this.accel.y = -this.accelGround;
        		this.direction = 3;
        		this.accel.x = 0;
        		this.vel.x = 0;
        	}else if (ig.input.state('down')){
        		this.accel.y = this.accelGround;
        		this.direction = 0;
        		this.accel.x = 0;
        		this.vel.x = 0;
        	}else {
        		this.accel.x = 0;
        		this.accel.y = 0;
        	}
        	this.setupAnimation(this.direction);

        	//shoot
        	if( ig.input.pressed('shoot') && ig.game.bullets > 0 && ig.game.gun) {
                ig.game.spawnEntity( EntityTopbullet, this.pos.x, this.pos.y, {direction:this.direction} );
                ig.game.bullets--;
                this.shootSFX.play();
            }
            
            if( this.accel.y < 0 ) {
            	this.currentAnim = this.anims.up;
            }else if( this.accel.y > 0 ) {
            	this.currentAnim = this.anims.down;
			 }else if( this.accel.x < 0 ) {
            	this.currentAnim = this.anims.left;
            }else if(this.accel.x > 0){
            	this.currentAnim = this.anims.right;
            }else{
            	this.currentAnim = this.anims.idle; // it is 0 so standing still
            }
            
            //invincibility
            if( this.invincibleTimer.delta() > this.invincibleDelay ) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }
            
            this.parent();
        },
            
        kill: function(){
        	this.deathSFX.play();
        	this.parent();
        	ig.game.respawnPosition = this.startPosition;
        	this.onDeath();
            //ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath} );
        },
        
        onDeath: function(){
            ig.game.stats.deaths ++;
            ig.game.lives --;
            if(ig.game.lives < 0){
                ig.game.gameOver();
            }else{
                ig.game.spawnEntity( EntityTopplayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);
            }
        },
        receiveDamage: function(amount, from){
            if(this.invincible)
                return;
            this.parent(amount, from);
        },
        
        draw: function(){
            if(this.invincible)
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
            this.parent();
            
            var x = ig.system.width/2, y = ig.system.height - 25;
            if(ig.game.level == 'Home' && !ig.game.instructText){
            	this.instructText.draw( 'Home.\nMake sure to grab your gun and Ammo!',
             	x, y, ig.Font.ALIGN.CENTER );
            }if(ig.game.level == 'Front' && !ig.game.instructText){
            	this.instructText.draw( 'Front Yard.\nI can Hear one of the puppies!',
             	x, y, ig.Font.ALIGN.CENTER );
            }if(ig.game.level == 'Forest' && !ig.game.instructText){
            	this.instructText.draw( 'The Forest.\nFind the puppy and make it out to the car!',
             	x, y, ig.Font.ALIGN.CENTER );
            }
        },
    	
	});
	
	EntityTopbullet = ig.Entity.extend({
        size: {x: 5, y: 5},
        animSheet: new ig.AnimationSheet( 'media/bulletSheet.png', 5, 5 ),
        maxVel: {x: 200, y: 200},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        verticle: false,
        direction: 0,
        init: function( x, y, settings ) {
        	this.direction = settings.direction;
        	if (settings.direction == 0 || settings.direction == 3){
        		this.verticle = true; 
        	}else if (settings.direction == 1 || settings.direction == 2){
        		this.verticle = false;
        	}
            this.parent( x+2 , y+2 , settings );
            this.addAnim( 'x', 0.2, [0] );
            this.addAnim( 'y', 0.2, [1] );
            if (this.verticle){
            	this.currentAnim = this.anims.y;
            	if (this.direction == 0)
            		this.vel.y = this.accel.y = this.maxVel.y;
            	if (this.direction == 3)
            		this.vel.y = this.accel.y = -this.maxVel.y;
            }else{
            	this.currentAnim = this.anims.x;
            	if (this.direction == 1)
            		this.vel.x = this.accel.x = -this.maxVel.x;
            	if (this.direction == 2)
            		this.vel.x = this.accel.x = this.maxVel.x;
            }
        },
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        check: function( other ) {
            other.receiveDamage( 3, this );
            this.kill();
        },
    });
    
});