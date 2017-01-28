
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


    var chain = af.waitTimeout(10, function() {
        console.log('hello1');

    }).waitTimeout(1000, { dog:'woof' }, function() {
        console.log('hello2', this);

    }).waitTimeout(function() {
        console.log('hello3');

    }).waitTimeout(500, { cat:'meow' }, function() {
        console.log('hello4');

    });
    
    console.log(chain);
    

});