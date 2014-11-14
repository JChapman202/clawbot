var five = require("johnny-five");
var Promise = require("bluebird");

/**
 * Constructor function for an instance of the ClawBot
 * @param {Object} [options] Optional options object which defines how this clawbot
 *                           will function.  Paramters include:
 *                           board - The instance of the johnny-five board to use
 *                           		if no such board is provided a new default instance will be created.
 */
function ClawBot(options) {
	//TODO: if we need to create our own board, I need to wait for it to be ready
	//TODO: we need to take in the pins for each device as part of our options
	var board = this._board = options.board ? options.board : new five.Board();

	this._leftDriveServo = new five.Servo({board: board, pin: 8, type: "continuous", pwmRange: [1000, 2000]});
	this._rightDriveServo = new five.Servo({board: board, pin: 9, type: "continuous", pwmRange: [1000, 2000]});

	this._armServo = new five.Servo({board: board, pin: 10, type: "continuous", pwmRange: [1000, 2000]});
	this._clawServo = new five.Servo({board: board, pin: 11, type: "continuous", pwmRange: [1000, 2000]});
}

function enableClaw() {
	return Promise.resolve();
}

ClawBot.prototype.leftDrive = function(percentage) {
	var speed = percentage;
	if (speed < 0) {
		this._leftDriveServo.cw(-1 * speed);
	}
	else if (speed > 0) {
		this._leftDriveServo.ccw(speed);
	}
	else {
		this._leftDriveServo.stop();
	}
};

ClawBot.prototype.rightDrive = function(percentage) {
	var speed = percentage;
	if (speed < 0) {
		this._rightDriveServo.ccw(-1 * speed);
	}
	else if (speed > 0) {
		this._rightDriveServo.cw(speed);
	}
	else {
		this._rightDriveServo.stop();
	}
};

ClawBot.prototype.openClaw = function(percentageRate) {
	return enableClaw.call(this).then(function() {
		this._clawServo.cw(percentageRate);
	}.bind(this));
};

ClawBot.prototype.closeClaw = function(percentageRate) {
	return enableClaw.call(this).then(function() {
		this._clawServo.ccw(percentageRate);
	}.bind(this));
};

ClawBot.prototype.stopClaw = function() {
	return enableClaw.call(this).then(function() {
		this._clawServo.stop();
	}.bind(this));
};

ClawBot.prototype.raiseArm = function(percentageRate) {
	return enableClaw.call(this).then(function() {
		this._armServo.ccw(percentageRate);
	}.bind(this));
};

ClawBot.prototype.lowerArm = function(percentageRate) {
	return enableClaw.call(this).then(function() {
		this._armServo.cw(percentageRate);
	}.bind(this));
};

ClawBot.prototype.stopArm = function() {
	return enableClaw.call(this).then(function() {
		this._armServo.stop();
	}.bind(this));
};

module.exports = ClawBot;