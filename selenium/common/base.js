const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

class Base {
    static getApp() {
        return process.env.APP || 'http://localhost:3000';
    }

    async getDriver() {
        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new Options().headless())
            .build();
        await driver.get(Base.getApp());
        return driver;
    }

    getApp() {
        return Base.getApp();
    }
}

module.exports = new Base();
