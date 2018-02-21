import webdriver from 'selenium-webdriver';
import config from 'config';
import * as driverManager from './driver-manager.js';
import * as mediaHelper from './media-helper.js';

const explicitWaitMS = config.get('explicitWaitMS');
const by = webdriver.By;

export function highlightElement(driver, selector, waitOverride) {
	if (config.has('highlightElements') && config.get('highlightElements')) {
		const timeoutWait = waitOverride ? waitOverride : explicitWaitMS;

		function setStyle(element, style) {
			const previous = element.getAttribute('style');
			element.setAttribute('style', style);
			setTimeout(() => {
				element.setAttribute('style', previous);
			}, 200);
			return 'highlighted';
		}

		let theElement = driver.findElement(selector);

		return driver.wait(function () {
			return driver.executeScript(setStyle, theElement, 'color: red; background-color: yellow;');
		}, timeoutWait, "Timed out waiting for element to be Highlighted");
	}
}

export function clickElement(driver, selector, waitOverride) {
	const timeoutWait = waitOverride ? waitOverride : explicitWaitMS;

	this.highlightElement(driver, selector, waitOverride);
	return driver.wait(function () {
		return driver.findElement(selector).then(function (element) {
			return element.click().then(function () {
				return true;
			}, function () {
				return false;
			});
		}, function () {
			return false;
		});
	}, timeoutWait, "Timed out waiting for element with ${selector.using} of '${selector.value}' to be clickable");
}

export function switchToFrame(driver, selector) {
	driver.switchTo().frame(driver.findElement(selector));
}

export function waitTillPresentAndDisplayed(driver, selector, waitOverride) {
	const timeoutWait = waitOverride ? waitOverride : explicitWaitMS;

	return driver.wait(function () {
		return driver.findElement(selector).then(function (element) {
			return element.isDisplayed().then(function () {
				return true;
			}, function () {
				return false;
			});
		}, function () {
			return false;
		});
	}, timeoutWait, `Timed out waiting for element with ${selector.using} of '${selector.value}' to be present and displayed`);
}

export function enterKeysInElement(driver, selector, value) {

	return driver.wait(function () {
		return driver.findElement(selector).then(function (element) {
			element.sendKeys(value);
			return element.getAttribute('value').then(actualValue => {
				return actualValue === value;
			}, function () {
				return false;
			});
		});
	}, explicitWaitMS, "Timed out waiting for element with ${selector.using} of '${selector.value}' to be settable to: '${value}'");
}

export function takeScreenshot(driver, filename) {
	//let browserName = global.browserName || 'chrome';

	return driver.takeScreenshot().then((data) => {
		mediaHelper.writeScreenshot(data, filename);
	}, (err) => {
		console.log(`Could not take screenshot due to error: '${err}'`);
	});
}
