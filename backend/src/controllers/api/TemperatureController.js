/**
 * @file Defines the Temperature Controller class.
 * @module TemperatureController
 * @author Sayaka Chishiki Jakobsson
 */

import { TemperatureModel } from '../../models/TemperatureModel.js'
import { loadDocument, buildMatchStage } from '../../utils/ControllerUtils.js'

/**
 * Encapsulates a controller.
 */
export class TemperatureController {
  /**
   * Loads a temperature document and attaches it to the request object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The ID of the hive document to load.
   * @returns {Promise<void>} - Promise that resolves when the hive document is loaded and attached to the request object.
   */
  async loadDocument (req, res, next, id) {
    return loadDocument(TemperatureModel, req, res, next, id)
  }

  /**
   * Sends a JSON response containing temperature of a hive.
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
   * Sends a JSON response containing temperature of alla hives.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const temperatures = await TemperatureModel.find()

      res.json(temperatures)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Calculates and sends the average temperature for a hive.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async getAverageTemperature (req, res, next) {
    try {
      const { id } = req.params
      const { from, to } = req.query

      const matchStage = buildMatchStage(id, from, to)

      const aggregationPipeline = [
        matchStage,
        {
          $addFields: {
            hour: {
              $dateToString: { format: '%Y-%m-%dT%H:00:00', date: '$timestamp' }
            }
          }
        },
        {
          $group: {
            _id: '$hour',
            avgTemperature: { $avg: '$temperature' }
          }
        },
        {
          $sort: { _id: 1 }
        },
        {
          $project: {
            _id: 0, // Exclude _id from the result
            hour: '$_id',
            avgTemperature: 1
          }
        }
      ]

      const data = await TemperatureModel.aggregate(aggregationPipeline)

      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No temperature data found for the specified hive and time range' })
      }
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
