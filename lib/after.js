import test from 'selenium-webdriver/testing';
import config from 'config';
import fs from 'fs-extra';
import * as mediaHelper from './media-helper';
import * as driverManager from './driver-manager';
import * as driverHelper from './driver-helper';

const afterHookTimeoutMS = config.get('afterHookTimeoutMS');

test.afterEach(function () {
	this.timeout(afterHookTimeoutMS);
	const driver = global.__BROWSER__;
	driverManager.clearCookiesAndDeleteLocalStorage(driver)
});


// Quit browser
test.after(function () {
	this.timeout(afterHookTimeoutMS);
	const driver = global.__BROWSER__;
	return driverManager.quitBrowser(driver);

});

/*
// Check for console errors
test.afterEach( function() {
	//this.timeout( afterHookTimeoutMS );
	const driver = global.__BROWSER__;
	return driverHelper.checkForConsoleErrors( driver );

} );

*/
// Take Screenshot
test.afterEach(function () {
	this.timeout(afterHookTimeoutMS);

	const driver = global.__BROWSER__;

	const fileName = (this.currentTest.parent.fullTitle() + " " + this.currentTest.title).replace(/[^\w_\-]/g, '_').toLowerCase().substr(0, config.screenshotMaxFileLenght);

	if (this.currentTest.state === 'failed') {

		driver.getCurrentUrl().then((url) => console.log(`FAILED: Taking screenshot of: '${url}'`), (err) => {
			console.log(`Could not capture the URL when taking a screenshot: '${err}'`);
		});

		return driverHelper.takeScreenshot(driver, fileName);
	}

	if (config.has('saveAllScreenshots') && config.get('saveAllScreenshots') === true) {
		const prefix = `PASSED-${screenSize}-${shortTestFileName}`;
		return driverHelper.takeScreenshot(driver);
	}
});


// Dismiss any alerts for switching away
/*test.afterEach( function() {
	this.timeout( afterHookTimeoutMS );
	const driver = global.__BROWSER__;

	if ( ( this.currentTest.state === 'failed' && ( config.get( 'closeBrowserOnComplete' ) === true ) ) ) {
		driverManager.dismissAllAlerts( driver );
	}
} );*/
