"use strict"

const puppeteer = require('puppeteer')

const [path = './resume.pdf'] = process.argv.slice(2)

async function print() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(`file://${__dirname}/resume.html`)
  await page.waitFor('*')

  await page.pdf({ path })

  await browser.close()
}

print().catch(console.error).then(process.exit)
