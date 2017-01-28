
require.config({
	paths: {
		aframe: 'aframe'
	}
});

require( ['aframe'], function(af) {

    // clear request after iteration amount
    /*
    var counter = 0;
    af.setInterval(function() {
        console.log('fire! ' + counter);
        counter++;

        if (counter > 10) {
            return false;
        }
    }, 100);
    */

    
    // clear request after timeout
    /* 
    var request = af.setInterval(function() {
        console.log('fire!');
    }, 100);

    af.setTimeout(function() {
        af.clear(request);
        console.log('hold!');
    }, 1000);
    */


    af.wait(function() {
        console.log('fire after 1st frame');

    }).wait(50, function() {
        console.log('fire after 51st frame');

    }).wait(function() {
        console.log('fire after 52nd frame');
    });


    /*
    var square = document.getElementById('square');
        square.className += 'animate';
    setTimeout(function() {
        square.className = '';
    }, 10);
    */
    
    

});