
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


    
    var request = af.wait(100, function() {
        console.log('hello 1');

    }).wait(300, { dog:'woof' }, function() {
        console.log('hello 2', this);

    }).wait(1000, function() {
        console.log('hello 3');

    }).wait(100, { cat:'meow' }, function() {
        console.log('hello 4', this);
    });

    /*af.setTimeout(function() {
        af.clear(request);
    }, 150);*/
    

});