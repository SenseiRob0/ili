/**
 * Web Worker. Loads a mesh from STL file.
 */


define([
    'three',
    'stloader'
],
function (THREE, STLLoader) {
    onmessage = function(e) {
        var blob = e.data;
        var reader = new FileReaderSync();
        readContents(reader.readAsArrayBuffer(blob));
    };

    function readContents(contents) {
        try {
            var geometry = new THREE.STLLoader().parse(contents);
        } catch (e) {
            console.info('Failure parsing STL file', e);
            postMessage({
                    status: 'failed',
                    message: 'Can not parse STL file. See log for details.',
            });
        }

        // TODO: This only works with binary file format. Handle text format.
        var attributes = {};
        for (var name in geometry.attributes) {
            attributes[name] = {
                array: geometry.attributes[name].array,
                itemSize: geometry.attributes[name].itemSize
            };
        }

        postMessage({
                status: 'completed',
                attributes: attributes,
        });
    }

    return onmessage;
});
