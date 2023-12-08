import path from 'path'
import * as fs from 'fs'
import type { Connection, ConnectionOptions } from 'typeorm'
import { createConnection } from 'typeorm'

export async function connectToDatabase(): Promise<Connection> {
  const environment = process.env.NODE_ENV || 'development'
  const configFilename = environment === 'production' ? 'ormconfig.production.json' : 'ormconfig.development.json'
  const rootPath = process.cwd()
  const configPath = path.join(rootPath, '', configFilename)

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8')
    const connectionOptions: ConnectionOptions = JSON.parse(configContent)

    const connection = await createConnection(connectionOptions)
    return connection
  }
  catch (error) {
    console.error('Failed to read or parse the configuration file:', error)
    throw error
  }
}
