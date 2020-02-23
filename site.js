var $motionBox = $('.motion-box');
var scale = 10;	
var isActivated = false;
var isTargetInSight = false;
var isKnockedOver = false;
var lostTimeout;
var canvas = document.getElementById('heat');

function initSuccess() {
	DiffCamEngine.start();
}
function initError() {
	alert('Something went wrong.');
}
function startComplete() {
	setTimeout(activate, 500);
}
function activate() {
	isActivated = true;
	play('activated');
}
function capture(payload) {
	if (!isActivated || isKnockedOver) {
		return;
	}

	var box = payload.motionBox;
	if (box) {
		
		var right = box.x.min * scale + 1;
		var top = box.y.min * scale + 1;
		var width = (box.x.max - box.x.min) * scale;
		var height = (box.y.max - box.y.min) * scale;
		var speed = (right+payload.score/50)+"kmh";
		document.getElementById('speed').innerText 	=`Kecepatan :${speed}`;
		document.getElementById('jarak').innerText 	=`Jarak :${right}`;
		document.getElementById('atas').innerText 	=`Atas :${top}`;
		document.getElementById('lebar').innerText 	=`Lebar :${width}`;
		document.getElementById('tinggi').innerText =`Tinggi :${height}`;
		document.getElementById('heatmap').innerText="Heat :"+ payload.score;
		
		$motionBox.css({
			display: 'block',
			right: right,
			top: top,
			width: width,
			height: height
		});

		if (!isTargetInSight) {
			isTargetInSight = true;
			play('fire');
			
		} else {
			//play('i-see-you');
		}

		clearTimeout(lostTimeout);
		lostTimeout = setTimeout(declareLost, 2000);
	}
	
	if (payload.checkMotionPixel(0, 0)) {
	//	knockOver();
	}
}

function declareLost() {
	isTargetInSight = false;
	play('target-lost');
	$motionBox.hide();
}


function play(audioId) {
	$('#audio-' + audioId)[0].play();
}


DiffCamEngine.init({
	video: document.getElementById('video'),

	motionCanvas: canvas,
	captureIntervalTime: 50,
	includeMotionBox: true,
	includeMotionPixels: true,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	startCompleteCallback: startComplete,
	captureCallback: capture
});



