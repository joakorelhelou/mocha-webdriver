import assert from 'assert';
import webdriver from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';
import config from 'config';
import GoogleHomePage from '../lib/pages/google-home-page.js';
import * as driverManager from '../lib/driver-manager.js';

var driver;

const mochaTimeoutMS = config.get( 'mochaTimeoutMS' );
const screenSize = driverManager.currentScreenSize();


test.describe( 'Google Test', function() {
	this.timeout( mochaTimeoutMS );

	test.before( function() {
		driver = driverManager.startBrowser();
	} );

	test.it( 'searches for content', function() {
		var page = new GoogleHomePage( driver );
		page.searchForQuery("Cheese");
	} );

} );
