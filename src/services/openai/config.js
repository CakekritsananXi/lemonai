const fs = require('fs');
const yaml = require('js-yaml');
const os = require('os');
const path = require('path');

/**
 * OpenAI Service Configuration
 * Loads configuration from environment variables or ~/.genspark_llm.yaml file
 */
class OpenAIConfig {
  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from file or environment variables
   */
  loadConfig() {
    const configPath = path.join(os.homedir(), '.genspark_llm.yaml');
    let config = {};

    // Try to load from config file
    if (fs.existsSync(configPath)) {
      try {
        const fileContents = fs.readFileSync(configPath, 'utf8');
        config = yaml.load(fileContents) || {};
      } catch (error) {
        console.warn('Failed to load config file:', error.message);
      }
    }

    // Override with environment variables
    return {
      apiKey: process.env.OPENAI_API_KEY || config.openai?.api_key,
      baseURL: process.env.OPENAI_BASE_URL || config.openai?.base_url,
      model: process.env.OPENAI_MODEL || 'gpt-5',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
    };
  }

  /**
   * Get configuration value
   */
  get(key) {
    return this.config[key];
  }

  /**
   * Validate configuration
   */
  validate() {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required. Please set OPENAI_API_KEY environment variable or configure ~/.genspark_llm.yaml');
    }
    if (!this.config.baseURL) {
      throw new Error('OpenAI base URL is required. Please set OPENAI_BASE_URL environment variable or configure ~/.genspark_llm.yaml');
    }
    return true;
  }

  /**
   * Get all configuration
   */
  getAll() {
    return { ...this.config };
  }
}

module.exports = OpenAIConfig;