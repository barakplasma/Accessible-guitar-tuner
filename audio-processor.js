class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.sampleLength = 100; // milliseconds
    this.lastProcessTime = 0;
    this.processInterval = 250; // milliseconds between processing
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) {
      return true;
    }

    const inputChannel = input[0];
    
    // Copy input samples to buffer
    for (let i = 0; i < inputChannel.length; i++) {
      this.buffer.push(inputChannel[i]);
    }

    // Check if we have enough samples and enough time has passed since last processing
    const currentTime = globalThis.currentTime;
    if (this.buffer.length > 0 && (currentTime - this.lastProcessTime) * 1000 >= this.processInterval) {
      // Send buffer to main thread for processing
      this.port.postMessage({
        type: 'audio-data',
        buffer: this.buffer.slice(), // Create a copy of the buffer
        sampleRate: 48000 // Default sample rate, will be updated by main thread
      });
      
      // Clear buffer
      this.buffer = [];
      this.lastProcessTime = currentTime;
    }

    // Pass through audio (optional, for monitoring)
    const output = outputs[0];
    if (output && output[0]) {
      for (let channel = 0; channel < input.length; channel++) {
        const outputChannel = output[channel];
        const inputChannel = input[channel];
        for (let i = 0; i < inputChannel.length; i++) {
          outputChannel[i] = inputChannel[i];
        }
      }
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);