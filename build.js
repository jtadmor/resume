"use strict"
const fs = require('fs')
const { JSDOM } = require('jsdom')

// Grab data and temapltes, create the DOM
const RESUME = require('./resume')
const BASE_HTML = fs.readFileSync('./templates/resume.html', 'utf-8')
let MARKDOWN = fs.readFileSync('./templates/RESUME.md', 'utf-8')
const { document } = new JSDOM(BASE_HTML).window


// Add everything
Object.keys(RESUME).forEach(content_key => {
  const content = RESUME[content_key]

  addHtml(content_key, content)
  addReadme(content_key, content)
})

// Write out
fs.writeFileSync('resume.html', document.documentElement.outerHTML)
fs.writeFileSync('RESUME.md', MARKDOWN)


// HELPERS
function addHtml(content_key, content, parent = document) {
  const container = document.querySelector(`.${content_key}`)

  if (!container) {
    throw new Error(`No DOM container found for ${content_key}`)
  }

  addContentToContainer(container, content_key, content)
}

function addContentToContainer(container, content_key, content) {
  if (typeof content === 'string') {
    container.textContent = content
  } else {
    /*
      For objects, there should be a scaffold component as the first child of the container.
      It should have properties that are equivalent to the keys of the object, to let us know where those values go.
      We remove the scaffold, iterate over the content array,
      and insert.
    */
    let template = container.firstChild

    while (template && !template.tagName) {
      template = template.nextSibling
    }

    if (!template) {
      throw new Error(`No DOM template found for ${content_key} where the content is complex`)
    }

    content.forEach(item => {
      if (typeof item === 'string') {
        const content_el = document.createElement(template.tagName)
        content_el.textContent = item
        container.appendChild(content_el)
      } else {
        const clone = template.cloneNode()
        clone.innerHTML = template.innerHTML

        Object.keys(item).forEach(key => {
          const value = item[key]

          if (typeof value === 'string') {
            clone.innerHTML = clone.innerHTML.replace(`_${key}`, value)
          } else {
            const sub_container = clone.querySelector(`.${key}`)
            addContentToContainer(sub_container, key, value)
          }
        })

        container.appendChild(clone)
      }
    })

    container.removeChild(template)
  }
}

function addReadme(content_key, content) {
  // TODO
}
