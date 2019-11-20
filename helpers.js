"use strict"

exports.isEmptyContent = content => (
  content == null ||
  content === '' ||
  (Array.isArray(content) && !content.length) ||
  (typeof content === 'object' && !Object.keys(content).length)
)

const findEl = (key, type, parent) => parent.querySelector(`[data-${type}=${key}]`)

const findEls = (key, type, parent) => parent.querySelectorAll(`[data-${type}=${key}]`)

const findElOrThrow = (key, type, parent) => {
  const el = findEl(key, type, parent)

  if (!el) {
    throw new Error(`No ${type} container found for ${key}. Use data-${type}="${key}"`)
  }

  return el
}

exports.findTemplateEl = (key, parent) => findElOrThrow(key, 'template', parent)

exports.findContainerEl = (key, parent) => (findEl(key, 'container', parent) || parent)

exports.findConditionalEls = (key, parent) => findEls(key, 'if', parent)
