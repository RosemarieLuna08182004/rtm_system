import { accessToken } from './accessToken';
import { refreshToken } from './refreshToken';
import { tableNumber } from './tableNumber';

class GenerateFn {
    accessToken: typeof accessToken;
    refreshToken: typeof refreshToken;
    tableNumber: typeof tableNumber;
    constructor() {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tableNumber = tableNumber;
    }
  }
  
export default new GenerateFn