/**
 * @file Defines the Humidity Controller class.
 * @module HumidityController
 * @author Sayaka Chishiki Jakobsson
 */

import { HumidityModel } from '../../models/HumidityModel.js'
import { loadDocument } from '../../utils/ControllerUtils.js'

/**
 * Encapsulates a controller.
 */
export class HumidityController {
  /**
   * Loads a humidity document and attaches it to the request object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The ID of the humidity document to load.
   * @returns {Promise<void>} - Promise that resolves when the humidity document is loaded and attached to the request object.
   */
  async loadDocument (req, res, next, id) {
    return loadDocument(HumidityModel, req, res, next, id)
  }

  /**
   * Sends a JSON response containing humidity of a hive.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async find (req, res, next) {
    res.json(req.doc)
  }

  /**
   * Sends a JSON response containing humidity of alla hives.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const humidities = await HumidityModel.find()

      res.json(humidities)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Fetches historical humidity data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async getHumidity (req, res, next) {
    try {
      const { id } = req.params
      const { from, to } = req.query
      const query = { hiveId: id }

      if (from && to) {
        query.timestamp = { $gte: new Date(from), $lte: new Date(to) }
      } else if (from) {
        query.timestamp = { $gte: new Date(from) }
      } else if (to) {
        query.timestamp = { $lte: new Date(to) }
      }

      const data = await HumidityModel.find(query)

      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No humidity data found for the specified hive and time range' })
      }

      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
