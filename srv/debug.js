// DEBUG ONLY – implementation of DebugService in debug.cds.
// Uncomment together with debug.cds to inspect the JWT. Never ship to production.


// import cds from '@sap/cds';

// export class DebugService extends cds.ApplicationService {
//   init() {
//     this.on('token', (req) => req.headers.authorization?.split(' ')[1]);
//     return super.init();
//   }
// }