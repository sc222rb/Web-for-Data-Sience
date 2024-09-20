/**
 * @file Defines the Weight Controller class.
 * @module WeightController
 * @author Sayaka Chishiki Jakobsson
 */

import { WeightModel } from '../../models/WeightModel.js'
import { loadDocument, buildMatchStage } from '../../utils/ControllerUtils.js'

/**
 * Encapsulates a controller.
 */
export class WeightController {
  /**
   * Loads a weight document and attaches it to the request object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The ID of the weight document to load.
   * @returns {Promise<void>} - Promise that resolves when the hive document is loaded and attached to the request object.
   */
  async loadDocument (req, res, next, id) {
    return loadDocument(WeightModel, req, res, next, id)
  }

  /**
   * Sends a JSON response containing weight of a hive.
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
   * Sends a JSON response containing weight of alla hives.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const weights = await WeightModel.find()

      res.json(weights)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Calculates and sends the average weight for a hive.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async getAverageWeight (req, res, next) {
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
            _id: '$hour', // Group by the hour
            avgWeight: { $avg: '$weight' }
          }
        },
        {
          $sort: { _id: 1 } // Sort by hour in ascending order
        },
        {
          $project: {
            _id: 0, // Exclude _id from the result
            hour: '$_id',
            avgWeight: 1
          }
        }
      ]

      const data = await WeightModel.aggregate(aggregationPipeline)

      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No weight data found for the specified hive and time range' })
      }

      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
