/**
 * @file Defines the Hive Controller class.
 * @module HiveController
 * @author Sayaka Chishiki Jakobsson
 */

import { HiveModel } from '../../models/HiveModel.js'
import { loadDocument } from '../../utils/ControllerUtils.js'

/**
 * Encapsulates a controller.
 */
export class HiveController {
  /**
   * Loads a hive document and attaches it to the request object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The ID of the hive document to load.
   * @returns {Promise<void>} - Promise that resolves when the hive document is loaded and attached to the request object.
   */
  async loadDocument (req, res, next, id) {
    return loadDocument(HiveModel, req, res, next, id)
  }

  /**
   * Sends a JSON response containing a hive.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      const hiveObj = req.doc.toObject()
      res.json(hiveObj)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing all hives.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const hives = await HiveModel.find()
      res.json(hives)
    } catch (error) {
      next(error)
    }
  }
}
