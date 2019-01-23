// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

describe('Definitions page', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(`${__HOST__}/definitions`, { timeout: 40000, waitUntil: 'domcontentloaded' })
  })

  it('should display "Available definitions" text on page', async () => {
    await expect(page).toMatch('Available definitions')
  })

  test('user can type a definition text and should display a component in the list', async () => {
    await page.waitForSelector('.rbt-input-main')
    await page.click('.rbt-input-main')
    await page.type('.rbt-input-main', 'async')
    await page.waitFor(2000)
    await page.waitForSelector('.rbt-menu>li')
    let element = await page.$('.rbt-menu li:nth-child(1) a')
    element.click()
    await page.waitForSelector('.componentsList')
    await page.waitFor(2000)
    await page.waitForSelector('.componentsList div:nth-child(0n+1) .componentRow')
    const componentTitle = await page.$('.componentName')
    const text = await (await componentTitle.getProperty('textContent')).jsonValue()
    await expect(text).toMatch('async')
    await page.waitForSelector(`.list-image`)
    await page.waitForSelector(`.list-activity-area`)

    const codeButtonElement = await page.$(`.addSourceComponent > i`)
    const codeButtonContent = await (await codeButtonElement.getProperty('className')).jsonValue()
    await expect(codeButtonContent).toMatch('fas fa-code')

    const inspectButtonElement = await page.$(`.inspectComponent > i`)
    const inspectButtonContent = await (await inspectButtonElement.getProperty('className')).jsonValue()
    await expect(inspectButtonContent).toMatch('fas fa-search')

    const copyButtonElement = await page.$(`.copyUrlButton > i`)
    const copyButtonContent = await (await copyButtonElement.getProperty('className')).jsonValue()
    await expect(copyButtonContent).toMatch('fas fa-copy')

    const switchButtonElement = await page.$(`.switchOrAddComponent > i`)
    const switchButtonContent = await (await switchButtonElement.getProperty('className')).jsonValue()
    await expect(switchButtonContent).toMatch('fas fa-exchange-alt')

    const undoButtonElement = await page.$(`.revertComponentChanges > i`)
    const undoButtonContent = await (await undoButtonElement.getProperty('className')).jsonValue()
    await expect(undoButtonContent).toMatch('fas fa-undo')

    const removeButtonElement = await page.$(`.removeComponent > i`)
    const removeButtonContent = await (await removeButtonElement.getProperty('className')).jsonValue()
    await expect(removeButtonContent).toMatch('fas fa-times list-remove')
  })

  test('should display the detail after clicking on a component in the list', async () => {
    const firstElement = '.componentsList > .ReactVirtualized__Grid__innerScrollContainer > div:nth-child(1)'
    await page.click(firstElement)
    await page.waitForSelector(`${firstElement} > div.two-line-entry > div.list-panel`)
    const component = `${firstElement} > div.two-line-entry > div.list-panel > div`
    const declaredElement = await page.$(`${component} > div.col-md-5 > div:nth-child(1) > div.col-md-2 > b`)
    const declaredContent = await (await declaredElement.getProperty('textContent')).jsonValue()
    await expect(declaredContent).toMatch('Declared')
    const sourceElement = await page.$(`${component} > div.col-md-5 > div:nth-child(2) > div.col-md-2 > b`)
    const sourceContent = await (await sourceElement.getProperty('textContent')).jsonValue()
    await expect(sourceContent).toMatch('Source')
    const releaseElement = await page.$(`${component} > div.col-md-5 > div:nth-child(3) > div.col-md-2 > b`)
    const releaseContent = await (await releaseElement.getProperty('textContent')).jsonValue()
    await expect(releaseContent).toMatch('Release')
    const discoveredElement = await page.$(`${component} > div.col-md-7 > div:nth-child(1) > div.col-md-2 > b`)
    const discoveredContent = await (await discoveredElement.getProperty('textContent')).jsonValue()
    await expect(discoveredContent).toMatch('Discovered')
    const attributionElement = await page.$(`${component} > div.col-md-7 > div:nth-child(2) > div.col-md-2 > b`)
    const attributionContent = await (await attributionElement.getProperty('textContent')).jsonValue()
    await expect(attributionContent).toMatch('Attribution')
    const filesElement = await page.$(`${component} > div.col-md-7 > div:nth-child(3) > div.col-md-2 > b`)
    const filesContent = await (await filesElement.getProperty('textContent')).jsonValue()
    await expect(filesContent).toMatch('Files')
  })

  test('should edit a license of a component in the list', async () => {
    await page.screenshot({ path: 'e2e/screenshots/license-0.png' })
    await page.waitForSelector(`.licensed-declared > span > span`)
    await page.click(`.licensed-declared > span > span`)
    await page.waitForSelector(`.spdx-picker`)
    await page.screenshot({ path: 'e2e/screenshots/license-1.png' })
    await page.click('.spdx-picker-header-buttons.col-md-2 > button.btn.btn-success')
    await page.screenshot({ path: 'e2e/screenshots/license-2.png' })
    /*const inputValue = await page.$eval(
      `${licenseField} > div > div > div.rbt-input.form-control > div > div > input`,
      el => el.value
    )
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace')
    }
    await page.type(`${licenseField} > div > div > div.rbt-input.form-control > div > div > input`, 'MIT')
    await page.screenshot({ path: 'e2e/screenshots/license-0.png' })
    await page.click('#rbt-menu-item-1')

    await page.waitForSelector(`${licenseField} > span.editable-field.bg-info`)
    await page.waitForSelector(`${component} > div.list-row > img.list-image.list-highlight`)*/
  })

  test('should open a modal while attempt to change a source location of a component in the list', async () => {
    await page.waitForSelector(`.described-sourceLocation > span > span`)
    await page.click(`.described-sourceLocation > span > span`)
    await page.screenshot({ path: 'e2e/screenshots/sourceLocation-0.png' })
    await page.waitForSelector(`.fade.in.modal > div.modal-dialog`)
    await page.click(`.fade.in.modal > div > div > div > div:nth-child(2) > button`)
    await page.screenshot({ path: 'e2e/screenshots/sourceLocation-1.png' })
  })

  test('should show an input field while attempting to change the release date of a component in the list', async () => {
    await page.waitForSelector(`.described-releaseDate > span`)
    await page.click(`.described-releaseDate > span`)
    await page.waitForSelector(`.described-releaseDate > input`)
  })

  test('should display a modal after clicking on the inspect button of a definition the list', async () => {
    await page.waitForSelector('.inspectComponent')
    await page.click('.inspectComponent')
    await page.waitFor(4000)
    page.waitForSelector('.fullDetaiView__modal')
  })
})
