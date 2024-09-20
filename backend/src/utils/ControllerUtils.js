/**
 * @file Defines the common controller utilities.
 * @module ControllerUtils
 * @author Sayaka Chishiki Jakobsson
 */

import createError from 'http-errors'
import mongoose, { Model } from 'mongoose'

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

/**
 * Builds the match stage for the aggregation pipeline based on query parameters.
 *
 * @param {string} id - The ID of the hive.
 * @param {string} from - The start date of the range.
 * @param {string} to - The end date of the range.
 * @returns {object} - The match stage object for the aggregation pipeline.
 */
export function buildMatchStage (id, from, to) {
  const matchStage = {
    $match: {
      hiveId: new mongoose.Types.ObjectId(id)
    }
  }

  if (from && to) {
    matchStage.$match.timestamp = {
      $gte: new Date(from),
      $lte: new Date(to)
    }
  } else if (from) {
    matchStage.$match.timestamp = {
      $gte: new Date(from)
    }
  } else if (to) {
    matchStage.$match.timestamp = {
      $lte: new Date(to)
    }
  }

  return matchStage
}
