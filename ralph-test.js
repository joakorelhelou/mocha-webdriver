var assert = require('assert');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var RalphSaysPage = require('./pages/ralph-page.js');

const mochaTimeOut = 30000; //ms
test.before(function() {
    this.timeout(mochaTimeOut);
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
 });

test.describe('Ralph Says', function() {
  this.timeout(mochaTimeOut);

  test.it('shows a quote container', function () {
    var ralphSaysPage = new RalphSaysPage(driver, true);
    ralphSaysPage.quoteContainerPresent().then(function(present) {
      assert.equal(present, true, "Quote container not displayed");
    });
  });

    test.it('shows a non-empty quote', function() {
        var ralphSaysPage = new RalphSaysPage(driver, true);
        ralphSaysPage.quoteContainerPresent().then(function(text) {
            assert.notEqual(text, '', 'Quote is empty');
        });
    });

});

test.afterEach(function() {
    driver.manage().deleteAllCookies();
});

test.after(function() {
    driver.quit();
});
