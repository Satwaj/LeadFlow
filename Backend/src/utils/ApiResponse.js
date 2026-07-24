class ApiResponse {
  constructor(message, data = null) {
    this.success = true;
    this.message = message;

    if (data !== null) {
      this.data = data;
    }
  }
}

export default ApiResponse;
