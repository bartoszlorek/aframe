
require.config({
	paths: {
		aframe: 'aframe'
	}
});

require( ['aframe'], function(af) {

    var request = af.setInterval(function() {
        console.log('fire!', this);
    }, 100, { pies:'woof!' });

    af.setTimeout(function() {
        af.clear(request);
        console.log('hold!');
    }, 1100);

});