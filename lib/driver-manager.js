import webdriver from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox';
import chrome from 'selenium-webdriver/chrome';
import config from 'config';
import path from 'path';
import assert from 'assert';
import _ from 'lodash';
import { times } from 'lodash';


const webDriverImplicitTimeOutMS = 2000;
const webDriverPageLoadTimeOutMS = 60000;
const browser = config.get('browser');

export function currentScreenSize() {
	var screenSize = "desktop";
	if (screenSize === undefined || screenSize === '') {
		screenSize = 'desktop';
	}
	return screenSize.toLowerCase();
}

export function getSizeAsObject() {
	switch (this.currentScreenSize()) {
		case 'mobile':
			return { width: 400, height: 1000 };
		case 'tablet':
			return { width: 1024, height: 1000 };
		case 'desktop':
			return { width: 1440, height: 1000 };
		case 'laptop':
			return { width: 1400, height: 790 };
		default:
			throw new Error('Unsupported screen size specified. Supported values are desktop, tablet and mobile.');
	}
}

/*export function getProxyType() {
	var proxyType = config.get( 'proxy' );
	switch ( proxyType.toLowerCase() ) {
		case 'direct':
			return proxy.direct();
		case 'system':
			return proxy.system();
		default:
			throw new Error( `Unknown proxy type specified of: '${proxyType}'. Supported values are 'direct' or 'system'` );
	}
}*/

export function startBrowser({ useCustomUA = true, resizeBrowserWindow = true } = {}) {

	if (global.__BROWSER__) {
		return global.__BROWSER__;
	}

	const screenSize = this.currentScreenSize();
	let driver;
	let options;
	let builder;
	let pref = new webdriver.logging.Preferences();

	pref.setLevel('browser', webdriver.logging.Level.SEVERE);

	switch (browser.toLowerCase()) {
		case 'chrome':
			options = new chrome.Options();
			options.setUserPreferences({ enable_do_not_track: true, credentials_enable_service: false });
			//options.setProxy( this.getProxyType() );
			options.addArguments('--no-sandbox');
			options.addArguments('--no-first-run');
			if (useCustomUA) {
				options.addArguments('user-agent=Mozilla/5.0 (wp-e2e-tests) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36');
			}
			builder = new webdriver.Builder();
			builder.setChromeOptions(options);
			global.__BROWSER__ = driver = builder.forBrowser('chrome').setLoggingPrefs(pref).build();
			global.browserName = 'chrome';
			break;
		case 'firefox':
			let profile = new firefox.Profile();
			profile.setNativeEventsEnabled(true);
			profile.setPreference('browser.startup.homepage_override.mstone', 'ignore');
			profile.setPreference('browser.startup.homepage', 'about:blank');
			profile.setPreference('startup.homepage_welcome_url.additional', 'about:blank');
			if (useCustomUA) {
				profile.setPreference('general.useragent.override', 'Mozilla/5.0 (wp-e2e-tests) Gecko/20100101 Firefox/46.0');
			}
			options = new firefox.Options().setProfile(profile);
			//options.setProxy( this.getProxyType() );
			builder = new webdriver.Builder();
			builder.setFirefoxOptions(options);
			global.__BROWSER__ = driver = builder.forBrowser('firefox').setLoggingPrefs(pref).build();
			global.browserName = 'firefox';
			break;
		default:
			throw new Error(`The specified browser: '${browser}' in the config is not supported. Supported browsers are 'chrome' and 'firefox'`);
	}

	driver.manage().timeouts().implicitlyWait(webDriverImplicitTimeOutMS);
	driver.manage().timeouts().pageLoadTimeout(webDriverPageLoadTimeOutMS);

	if (resizeBrowserWindow) {
		this.resizeBrowser(driver, screenSize);
	}

	return driver;
}

export function resizeBrowser(driver, screenSize) {
	if (typeof (screenSize) === 'string') {
		switch (screenSize.toLowerCase()) {
			case 'mobile':
				driver.manage().window().setSize(400, 1000);
				break;
			case 'tablet':
				driver.manage().window().setSize(1024, 1000);
				break;
			case 'desktop':
				driver.manage().window().setSize(1440, 1000);
				break;
			case 'laptop':
				driver.manage().window().setSize(1400, 790);
				break;
			default:
				throw new Error('Unsupported screen size specified (' + screenSize + '). Supported values are desktop, tablet and mobile.');
		}
	} else {
		throw new Error('Unsupported screen size specified (' + screenSize + '). Supported values are desktop, tablet and mobile.');
	}
}

export function clearCookiesAndDeleteLocalStorage(driver) {
	driver.manage().deleteAllCookies();
	return this.deleteLocalStorage(driver);
}

export function deleteLocalStorage(driver) {
	driver.getCurrentUrl().then((url) => {
		if (url.startsWith('data:') === false && url !== 'about:blank') {
			return driver.executeScript('window.localStorage.clear();');
		}
	});
}

export function quitBrowser(driver) {
	// Sleep for 3 seconds before closing the browser to make sure all JS console errors are captured
	return driver.sleep(3000).then(function () {
		return driver.quit();
	});
}
