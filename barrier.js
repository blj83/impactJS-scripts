ig.module(
	'game.entities.barrier'
)
.requires(
	'impact.entity'
)

.defines(function(){
	EntityBarrier = ig.Entity.extend({
		size: {x:16, y:16},
		instructText: new ig.Font( 'media/04b03.font.png' ),
		_wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
		type: ig.Entity.TYPE.NONE,
		message: false,
		message2: false,
		bounciness: 10,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.ACTIVE,
		
		init: function(x,y, settings){
			this.parent(x,y,settings);
		},
		
		update: function(){
			
		},
		check: function( other ) {
        	if (!ig.game.gun && ig.game.level == 'Home'){
        		this.message = true;
        		other.vel.y = this.bounciness;
        	}else if(!ig.game.found && ig.game.level == 'Forest'){
        		this.message2 = true;
        		other.vel.x = -this.bounciness;
        	}
        	else if(ig.input.pressed('down') && ig.game.level == 'Slc'){
        		other.vel.y = 500
        	}
        	else{
        		other.vel.y = -5;
        	}	 		
        },
        
        draw: function(){
        	if (this.message){
        		var x = ig.system.width/2, y = 0 +20;
        		this.instructText.draw( 'You have to get your gun!!',
             	x, y, ig.Font.ALIGN.CENTER );
        	}else if(this.message2){
        		var x = ig.system.width/2, y = 0 +20;
        		this.instructText.draw( 'You have to get spot!!',
             	x, y, ig.Font.ALIGN.CENTER );
        	}
        }
	});
});