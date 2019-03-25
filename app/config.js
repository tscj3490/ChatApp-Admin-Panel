class Config{
    constructor(){
        // this.EXCHANGE_RATE_API_URL="http://api.openrates.io" 
        this.EXCHANGE_RATE_API_URL="https://api.exchangeratesapi.io"
        // this.BACKEND_API_URL="http://localhost:3031"
        // this.BACKEND_FILE_URL="http://localhost:3032/"
        this.BACKEND_API_URL="http://18.191.175.213:3031"
        this.BACKEND_FILE_URL="http://18.191.175.213:3032/"
    }
}

export default (new Config)