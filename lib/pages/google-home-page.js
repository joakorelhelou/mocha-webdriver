import webdriver from 'selenium-webdriver';
import config from 'config';
import BasePage from '../base-page.js';

export default class GoogleHomePage extends BasePage {
	constructor( driver, visit = true ) {
		//Web elements selectors
		const queryInput = webdriver.By.name( 'q' );
		const searchBtn = webdriver.By.name( 'btnK' );

		super( driver, queryInput, visit, config.get( 'baseUrl' ) );
		this.queryInput = queryInput;
		this.searchBtn = searchBtn;
	}
	
	searchForQuery(query) {
		this.driver.findElement( this.queryInput ).then(e => {
			e.sendKeys(query);
			e.submit();
		});

	}
}
