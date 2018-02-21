import fs from 'fs-extra';
import path from 'path';
import webdriver from 'selenium-webdriver';
import config from 'config';


export function writeScreenshot(data, prefix, i18nScreenshot) {
    if (prefix === undefined) {
        prefix = '';
    }

    let screenShotBase = __dirname + '/../mochawesome-reports';
    if (process.env.TEMP_ASSET_PATH) {
        screenShotBase = process.env.TEMP_ASSET_PATH;
    }

    let directoryName = 'screenshots';
    if (i18nScreenshot === true) {
        directoryName = 'screenshots-i18n';
    }
    let screenShotDir = path.resolve(screenShotBase, directoryName);
    if (!fs.existsSync(screenShotDir)) {
        fs.mkdirSync(screenShotDir);
    }
    let dateString = new Date().getTime().toString();
    let fileName = `${prefix}.png`;
    let screenshotPath = `${screenShotDir}/${fileName}`;
    fs.writeFileSync(screenshotPath, data, 'base64');

    return screenshotPath;
}

export function writeTextLogFile(textContent, prefix, pathOverride) {
    if (prefix === undefined) {
        prefix = '';
    }
    let directoryName = pathOverride || '../logs';
    let logDir = path.resolve(__dirname, directoryName);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    let dateString = new Date().getTime().toString();
    let fileName = `${dateString}-${prefix}-log.txt`;
    let logPath = `${logDir}/${fileName}`;
    fs.writeFileSync(logPath, textContent);

    return logPath;
}