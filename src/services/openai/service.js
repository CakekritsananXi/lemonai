const OpenAI = require('openai');
const OpenAIConfig = require('./config');

/**
 * OpenAI Service Wrapper
 * Provides a high-level interface to interact with OpenAI API
 */
class OpenAIService {
  constructor() {
    this.config = new OpenAIConfig();
    this.config.validate();
    
    this.client = new OpenAI({
      apiKey: this.config.get('apiKey'),
      baseURL: this.config.get('baseURL'),
      defaultHeaders: {
        'User-Agent': 'LemonAI/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create a chat completion
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Completion response
   */
  async createChatCompletion(messages, options = {}) {
    try {
      const completion = await this.client.chat.completions.create({
        model: options.model || this.config.get('model'),
        messages: messages,
        max_tokens: options.maxTokens || this.config.get('maxTokens'),
        temperature: options.temperature !== undefined ? options.temperature : this.config.get('temperature'),
        stream: options.stream || false,
      });

      return completion;
    } catch (error) {
      console.error('OpenAI Chat Completion Error:', error);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  /**
   * Create a streaming chat completion
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Additional options
   * @returns {Promise<AsyncIterator>} Streaming completion response
   */
  async createStreamingChatCompletion(messages, options = {}) {
    try {
      const stream = await this.client.chat.completions.create({
        model: options.model || this.config.get('model'),
        messages: messages,
        max_tokens: options.maxTokens || this.config.get('maxTokens'),
        temperature: options.temperature !== undefined ? options.temperature : this.config.get('temperature'),
        stream: true,
      });

      return stream;
    } catch (error) {
      console.error('OpenAI Streaming Chat Completion Error:', error);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  /**
   * Generate a response for a single prompt
   * @param {string} prompt - User prompt
   * @param {string} systemPrompt - System prompt
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Generated response
   */
  async generateResponse(prompt, systemPrompt = 'You are a helpful assistant.', options = {}) {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const completion = await this.createChatCompletion(messages, options);
    return completion.choices[0]?.message?.content || '';
  }

  /**
   * Generate a streaming response for a single prompt
   * @param {string} prompt - User prompt
   * @param {string} systemPrompt - System prompt
   * @param {Function} onChunk - Callback for each chunk
   * @param {Object} options - Additional options
   */
  async generateStreamingResponse(prompt, systemPrompt = 'You are a helpful assistant.', onChunk = null, options = {}) {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const stream = await this.createStreamingChatCompletion(messages, options);
    
    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      if (onChunk) {
        onChunk(content, fullResponse);
      }
    }
    
    return fullResponse;
  }

  /**
   * List available models
   * @returns {Promise<Array>} List of available models
   */
  async listModels() {
    try {
      const models = await this.client.models.list();
      return models.data;
    } catch (error) {
      console.error('OpenAI List Models Error:', error);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  /**
   * Check if the service is available
   * @returns {Promise<boolean>} True if service is available
   */
  async isAvailable() {
    try {
      await this.listModels();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get service configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    const config = this.config.getAll();
    return {
      ...config,
      apiKey: config.apiKey ? '***' : undefined, // Mask API key for security
    };
  }
}

module.exports = OpenAIService;