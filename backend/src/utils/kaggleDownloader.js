import fetch from 'node-fetch'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import unzip from 'unzipper'
import { parse } from 'csv-parse'
import { HiveModel } from '../models/HiveModel.js'
import { HumidityModel } from '../models/HumidityModel.js'
import { TemperatureModel } from '../models/TemperatureModel.js'
import { WeightModel } from '../models/WeightModel.js'
import { FlowModel } from '../models/FlowModel.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import moment from 'moment'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const hives = [
  { name: 'Wurzburg', location: 'Wurzburg' },
  { name: 'Schwartau', location: 'Schwartau' }
]

/**
 * Connects to the database.
 */
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

/**
 * Gets or creates a hive in MongoDB.
 *
 * @param {string} hiveName - The name of the hive.
 * @returns {Promise<import('../models/HiveModel').IHive>} The hive document.
 * @throws {Error}
 */
const getOrCreateHive = async (hiveName) => {
  try {
    const hive = hives.find(h => h.name === hiveName)
    return await HiveModel.findOneAndUpdate(hive, hive, {
      upsert: true,
      new: true,
      runValidators: true
    })
  } catch (error) {
    console.error('Error creating/updating Hive:', error.message)
    throw error
  }
}

/**
 * Downloads a dataset from Kaggle.
 *
 * @param {string} dataset - The dataset to download.
 * @param {string} tokenPath - The path to the token file.
 */
export const downloadDataset = async (dataset, tokenPath) => {
  try {
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.key}`
    }
    const url = `https://www.kaggle.com/api/v1/datasets/download/${dataset}`
    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`Failed to download dataset: ${response.statusText}`)
    }

    const destDir = path.join(__dirname, '..', '..', 'data', dataset.replace('/', '_'))
    const destPath = path.join(destDir, `${dataset.replace('/', '_')}.zip`)

    // Ensure the directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    const dest = fs.createWriteStream(destPath)
    response.body.pipe(dest)

    dest.on('finish', () => {
      console.log(`Dataset downloaded: ${destPath}`)
      extractAndSaveDataset(destPath, destDir)
    })
  } catch (error) {
    console.error('Error downloading dataset:', error)
  }
}

/**
 * Extracts and saves the dataset from a zip file.
 *
 * @param {string} zipFilePath - The path to the zip file.
 * @param {string} extractToPath - The path to extract the dataset to.
 */
const extractAndSaveDataset = async (zipFilePath, extractToPath) => {
  fs.createReadStream(zipFilePath)
    .pipe(unzip.Extract({ path: extractToPath }))
    .on('close', async () => {
      console.log(`Dataset extracted to: ${extractToPath}`)

      // Process files for both hives and all years
      for (const hive of hives) {
        const files = [
          `flow_${hive.name.toLowerCase()}.csv`,
          `humidity_${hive.name.toLowerCase()}.csv`,
          `temperature_${hive.name.toLowerCase()}.csv`,
          `weight_${hive.name.toLowerCase()}.csv`
        ]

        for (const file of files) {
          try {
            await parseAndSaveCSV(path.join(extractToPath, file), hive.name)
          } catch (error) {
            console.error(`Error processing ${file}:`, error)
          }
        }
      }
    })
}

/**
 * Parses and saves a CSV file to MongoDB.
 *
 * @param {string} csvFilePath - The path to the CSV file.
 * @param {string} hiveName - The name of the hive.
 */
const parseAndSaveCSV = async (csvFilePath, hiveName) => {
  let hiveDoc
  try {
    hiveDoc = await getOrCreateHive(hiveName)
  } catch (error) {
    console.error('Error creating/updating Hive:', error.message)
    return
  }

  const fileName = path.basename(csvFilePath)
  const batchSize = 1000

  let records = []

  const parser = fs.createReadStream(csvFilePath)
    .pipe(parse({ columns: true }))

  parser.on('data', (data) => {
    // Convert timestamp to UTC
    const timestamp = moment.utc(data.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate()

    // Create a record object with hiveId and timestamp
    const record = {
      hiveId: hiveDoc._id,
      timestamp
    }

    // Depending on the file type, add the appropriate field to the record
    if (fileName.includes('weight')) {
      let weight = parseFloat(data.weight)
      // Apply the specific conversion for Schwartau hive
      if (hiveName === 'Schwartau') {
        weight /= 1000
      }
      if (!isNaN(weight)) {
        record.weight = weight
        records.push(record)
      } else {
        console.warn(`Invalid weight value: ${data.weight} in file ${csvFilePath}`)
      }
    } else if (fileName.includes('humidity')) {
      const humidity = parseFloat(data.humidity)
      if (!isNaN(humidity)) {
        record.humidity = humidity
        records.push(record)
      } else {
        console.warn(`Invalid humidity value: ${data.humidity} in file ${csvFilePath}`)
      }
    } else if (fileName.includes('temperature')) {
      const temperature = parseFloat(data.temperature)
      if (!isNaN(temperature)) {
        record.temperature = temperature
        records.push(record)
      } else {
        console.warn(`Invalid temperature value: ${data.temperature} in file ${csvFilePath}`)
      }
    } else if (fileName.includes('flow')) {
      const flow = parseFloat(data.flow)
      if (!isNaN(flow)) {
        record.flow = flow
        records.push(record)
      } else {
        console.warn(`Invalid flow value: ${data.flow} in file ${csvFilePath}`)
      }
    }

    // Batch insert records
    if (records.length >= batchSize) {
      if (fileName.includes('weight')) {
        WeightModel.insertMany(records).catch(err => console.error('Error saving weight data:', err))
      } else if (fileName.includes('humidity')) {
        HumidityModel.insertMany(records).catch(err => console.error('Error saving humidity data:', err))
      } else if (fileName.includes('temperature')) {
        TemperatureModel.insertMany(records).catch(err => console.error('Error saving temperature data:', err))
      } else if (fileName.includes('flow')) {
        FlowModel.insertMany(records).catch(err => console.error('Error saving flow data:', err))
      }
      records = [] // Clear the records array after insertion
    }
  })

  parser.on('end', async () => {
    // Insert any remaining records after the file has been completely parsed
    if (records.length > 0) {
      try {
        if (fileName.includes('weight')) {
          await WeightModel.insertMany(records)
          console.log(`Weight data from ${csvFilePath} saved to MongoDB`)
        } else if (fileName.includes('humidity')) {
          await HumidityModel.insertMany(records)
          console.log(`Humidity data from ${csvFilePath} saved to MongoDB`)
        } else if (fileName.includes('temperature')) {
          await TemperatureModel.insertMany(records)
          console.log(`Temperature data from ${csvFilePath} saved to MongoDB`)
        } else if (fileName.includes('flow')) {
          await FlowModel.insertMany(records)
          console.log(`Flow data from ${csvFilePath} saved to MongoDB`)
        }
      } catch (error) {
        console.error(`Error saving data from ${csvFilePath} to MongoDB:`, error)
      }
    }
  })

  parser.on('error', (err) => {
    console.error('Error parsing CSV:', err.message)
  })
}

/**
 * The main function that starts the server.
 */
const main = async () => {
  try {
    await connectToDatabase()
    const dataset = 'se18m502/bee-hive-metrics'
    const tokenPath = path.join(__dirname, '..', '..', '.kaggle.json')

    await downloadDataset(dataset, tokenPath)
  } catch (error) {
    console.error('Failed to start server:', error)
  }
}

main()
