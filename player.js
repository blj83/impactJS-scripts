ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/gangstasheet.png', 16, 16 ),
        size: {x: 8, y:14},
        offset: {x: 4, y: 2},  // collision offset - from sprite (collision smaller than sprite)
        flip: false,		  // sprite is facing in the correct diretion, originally.

		// adding some simple physics
        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,
        
        //collision
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        //handle respawn
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer:null,
        instructText: new ig.Font( 'media/04b03.font.png' ),
        
        //sound
        jumpSFX: new ig.Sound( 'media/sounds/jump.*' ),
        shootSFX: new ig.Sound( 'media/sounds/shoot.*' ),
        deathSFX: new ig.Sound( 'media/sounds/death.*' ),
		
		// defining the animatin sequence
        init: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	this.addAnim( 'idle', 1, [0] );
        	this.addAnim( 'run', 0.1, [1,2,3,4] );
        	this.addAnim( 'jump', 1, [5] );
        	this.addAnim( 'fall', 0.4, [6] );
        	this.startPosition = {x:x,y:y};
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
			ig.game.gravity = 300;
        },
        
        makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        },

		// note the ','s you need that otherwise program may not load (or if you are lucky you will 
	    // see an error)
        update: function() {
	
			// **** enable your player to move
		
            // move left or right
        	var accel = this.standing ? this.accelGround : this.accelAir;
        	if( ig.input.state('left') ) {
        		this.accel.x = -accel;
        		this.flip = true;   // sets the direction of the sprite
        	}else if( ig.input.state('right') ) {
        		this.accel.x = accel;
        		this.flip = false;
        	}else{
        		this.accel.x = 0;
        	}
        	// jump
        	if( this.standing && ig.input.pressed('jump') ) {
        		this.vel.y = -this.jump;
        		this.jumpSFX.play();
        	}
        	
        	if (ig.input.pressed('switch')){
        		if (ig.game.weapon == 0 && ig.game.assault)
        			ig.game.weapon = 1;
        		else
        			ig.game.weapon = 0;
        		if  (ig.game.aBullets < 0)
        			ig.game.weapon = 0;
        	}
        	//shoot
        	if( ig.input.pressed('shoot') && ig.game.bullets > 0) {
                ig.game.spawnEntity( EntityBullet, this.pos.x, this.pos.y, {flip:this.flip} );
                if (ig.game.assault && ig.game.aBullets > 0 && ig.game.weapon == 1)
                	ig.game.aBullets--;
                else if(ig.game.weapon == 0 && ig.game.bullets > 0)	
                	ig.game.bullets--;
                this.shootSFX.play();
            }
            
			if (ig.game.goal == 0){
				ig.game.winGame();
			}
			// make the animation look good! Beautification!
            // set the current animation, based on the player's speed

			// check the vertical velocity first
            if( this.vel.y < 0 ) {
            	this.currentAnim = this.anims.jump;
            }else if( this.vel.y > 0 ) {
            	this.currentAnim = this.anims.fall;

			// now the horizontal velocity
            }else if( this.vel.x != 0 ) {
            	this.currentAnim = this.anims.run;
            }else{
            	this.currentAnim = this.anims.idle; // it is 0 so standing still
            }
            this.currentAnim.flip.x = this.flip;
            
            //invincibility
            if( this.invincibleTimer.delta() > this.invincibleDelay ) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }
        	// move!
        	this.parent();
        },
        //just added
        kill: function(){
        	this.deathSFX.play();
        	this.parent();
        	ig.game.respawnPosition = this.startPosition;
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath} );
        },
        onDeath: function(){
            ig.game.stats.deaths++;
            ig.game.lives --;
            if(ig.game.lives < 0){
                ig.game.gameOver();
            }else{
                ig.game.spawnEntity( EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);
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
            if(ig.game.level == 'Slc' && !ig.game.instructText){
            	this.instructText.draw( 'The SLC.\nFight your way through and find the puppy!',
             	x, y, ig.Font.ALIGN.CENTER );
            }
            if(ig.game.level == 'Myers' && !ig.game.instructText){
            	this.instructText.draw( 'Myers.\nI can see a puppy on the roof.',
             	x, y, ig.Font.ALIGN.CENTER );
            }
            if(ig.game.level == 'Tate' && !ig.game.instructText){
            	this.instructText.draw( 'Tate. All the lights are out. \nThe last puppy is through one of these doors',
             	x, y, ig.Font.ALIGN.CENTER );
            }
            if(ig.game.level == 'Room1' && !ig.game.instructText){
            	this.instructText.draw( 'Empty Room. That gun might come in handy',
             	x, y, ig.Font.ALIGN.CENTER );
            }
            if(ig.game.level == 'Room2' && !ig.game.instructText){
            	this.instructText.draw( 'A long dark hallway. \nZombies are coming from both directions!!',
             	x, y, ig.Font.ALIGN.CENTER );
            }
            if(ig.game.level == 'Room3' && !ig.game.instructText){
            	this.instructText.draw( 'There seems to be a long drop. \nAll the zombies are faster for some reason!!',
             	x, y, ig.Font.ALIGN.CENTER );
            }if(ig.game.level == 'Room4' && !ig.game.instructText){
            	this.instructText.draw( 'There is something huge up ahead!! \nAnd I can hear the last puppy! \nIf you need more weapons you can go back through the door.',
             	x, y, ig.Font.ALIGN.CENTER );
            }
            if(ig.game.level == 'Room5' && !ig.game.instructText){
            	this.instructText.draw( 'It doesn look like you would want to fall down there.',
             	x, y, ig.Font.ALIGN.CENTER );
            }
            if(ig.game.level == 'Room1' || ig.game.level == 'Room2' || ig.game.level == 'Room3' || ig.game.level == 'Room4' || ig.game.level == 'Room5' || ig.game.level == 'Tate' && !ig.game.instructText && ig.game.assault){
            	this.instructText.draw( 'To Switch weapons press tab',
             	x-10, y-10, ig.Font.ALIGN.CENTER );
            }
        },
    });
    
    EntityBullet = ig.Entity.extend({
        size: {x: 5, y: 3},
        animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),
        maxVel: {x: 200, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        bullets: 50,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+5, settings );
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'idle', 0.2, [0] );
        },
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        check: function( other ) {
        	if (ig.game.assault == true && ig.game.weapon == 1){
        		other.receiveDamage( 7, this );
        	}else{
            	other.receiveDamage( 3, this );
            }
            this.kill();
        },
    });
    
    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
    });
    
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });

    
});
