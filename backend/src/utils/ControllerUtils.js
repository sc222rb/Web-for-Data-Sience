/**
 * @file Defines the common controller utilities.
 * @module ControllerUtils
 * @author Sayaka Chishiki Jakobsson
 */

import createError from 'http-errors'
import { Model } from 'mongoose'

/**
 * Loads a document by ID and attaches it to the request object.
 *
 * @param {Model} model - Mongoose model to use for finding the document.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the document to load.
 * @returns {Promise<void>} - Promise that resolves when the document is loaded and attached to the request object.
 */
export async function loadDocument (model, req, res, next, id) {
  try {
    const doc = await model.findById(id)
    if (!doc) {
      return next(createError(404, `${model.modelName} data not found`))
    }
    req.doc = doc
    next()
  } catch (error) {
    next(error)
  }
}
