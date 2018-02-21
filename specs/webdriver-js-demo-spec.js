import assert from 'assert';
import webdriver from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';
import config from 'config';
import WebDriverJsDemoPage from '../lib/pages/webdriver-js-demo-page.js';
import WebDriverJsErrorPage from '../lib/pages/webdriver-js-error-page.js';
import WebDriverJsLeavePage from '../lib/pages/webdriver-js-leave-page.js';
import * as driverManager from '../lib/driver-manager.js';


let driver = null;

const mochaTimeoutMS = config.get( 'mochaTimeoutMS' );

test.before( function() {
	this.timeout( mochaTimeoutMS );
	driver = driverManager.startBrowser();

} );

test.describe( 'WebDriverJsDemo', function() {
	this.timeout( mochaTimeoutMS );

	test.it( 'can wait for an element to appear', function() {
		let page = new WebDriverJsDemoPage( driver, true );
		page.waitForChildElementToAppear();
		page.childElementPresent().then( ( present ) => {
			assert.equal( present, true, 'The child element is not present' );
		} );
	} );

	test.it( 'can check for an alert when leaving the page', function() {
		let page = new WebDriverJsLeavePage( driver, true );
		page.navHome();
	} );

	test.it( 'can check for errors when there should be none', function() {
		let page = new WebDriverJsDemoPage( driver, true );
		page.consoleErrors().then( ( errors ) => {
			assert.deepEqual( errors, [], "We got an error" );
		} );
	} );

	test.it( 'can check for errors when there are present', function() {
		let page = new WebDriverJsErrorPage( driver, true );
		page.consoleErrors().then( ( errors ) => {
			assert.deepEqual( errors, [ 'http://webdriverjsdemo.github.io/scripts/error.js 0:0 Uncaught' ]);
		} );
	} );
} );

test.afterEach( function() {
	if ( this.currentTest.state === 'failed' ) {
		driver.get( 'data:,' );
		driver.switchTo().alert().then( ( alert ) => {
			alert.accept();
		}, () => {} );
	}
} );
