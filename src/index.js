
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

    
    var request = af.wait(function() {
        console.log('hello');

    }).wait(300, "John", function(name) {
        console.log('my name is ' + name);

    }).wait(1000, ['cats', 'dogs'], function(pets) {
        console.log('I like ' + pets.join(' and '));

    }).wait(100, function() {
        console.log('bye');
    });

    /*
    af.setTimeout(function() {
        af.clear(request);
    }, 500);*/


});