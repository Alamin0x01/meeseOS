/**
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-Present, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @license Simplified BSD License
 */

const modifierNames = ["ctrl", "shift", "alt", "meta"];

/**
 * @typedef {Object} NormalizedEventPosition
 * @property {Number} clientX
 * @property {Number} clientY
 * @property {Boolean} touch
 * @property {Element} target
 */

/**
 * Checks if keycombo matches
 * @param {String} combo Key combo
 * @param {Event} ev Event
 * @returns {Boolean}
 */
export const matchKeyCombo = (combo, ev) => {
	const checkKeys = String(combo).toLowerCase().split("+");
	const keyName = String(ev.key).toLowerCase();
	const validKeypress = checkKeys.every((k) =>
		modifierNames.indexOf(k) !== -1 ? ev[k + "Key"] : keyName === k
	);

	return validKeypress;
};

/**
 * Normalizes event input (position)
 * @param {Event} ev Event
 * @returns {NormalizedEventPosition}
 */
export const getEvent = (ev) => {
	let { clientX, clientY, target } = ev;
	const touch = ev.touches || ev.changedTouches || [];

	if (touch.length) {
		clientX = touch[0].clientX;
		clientY = touch[0].clientY;
	}

	return { clientX, clientY, touch: touch.length > 0, target };
};

/**
 * Creates a double-tap event handler
 * @param {Number} [timeout=250] Timeout
 * @returns {Function} Handler with => (ev, cb)
 */
export const doubleTap = (timeout = 250) => {
	let tapped = false;
	let timer;

	return (ev, cb) => {
		timer = clearTimeout(timer);
		timer = setTimeout(() => (tapped = false), timeout);

		if (tapped) {
			ev.preventDefault();
			return cb(ev);
		}

		tapped = true;

		return false;
	};
};
