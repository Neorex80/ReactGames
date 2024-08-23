class Stockfish {
    constructor() {
      this.engine = new Worker('stockfish.js');
      this.engine.postMessage('uci');
    }
  
    getBestMove(fen, callback) {
      this.engine.postMessage(`position fen ${fen}`);
      this.engine.postMessage('go depth 15');
  
      this.engine.onmessage = (event) => {
        if (event.data.startsWith('bestmove')) {
          const bestMove = event.data.split(' ')[1];
          callback(bestMove);
        }
      };
    }
  }
  
  export default Stockfish;
  