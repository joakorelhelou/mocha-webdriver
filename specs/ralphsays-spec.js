import assert from 'assert';
import webdriver from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';
import config from 'config';
import RalphSaysPage from '../lib/pages/ralph-says-page.js';
import * as driverManager from '../lib/driver-manager.js';

var driver;

const mochaTimeoutMS = config.get( 'mochaTimeoutMS' );
const screenSize = driverManager.currentScreenSize();


test.describe( 'Ralph Says', function() {
	this.timeout( mochaTimeoutMS );

	test.before( function() {
		driver = driverManager.startBrowser();
	} );

	test.it( 'shows a quote container', function() {
		var page = new RalphSaysPage( driver );
		page.quoteContainerPresent().then( function( present ) {
			assert.equal( present, true, 'Quote container not displayed' );
		} );
	} );

	test.it( 'shows a non-empty quote', function() {
		var page = new RalphSaysPage( driver );
		page.quoteTextDisplayed().then( function( text ) {
			assert.notEqual( text, '', 'Quote is empty' );
		} );
	} );

} );
