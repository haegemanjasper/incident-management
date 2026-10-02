import cds from '@sap/cds'

export class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  async init() {
    this.before('UPDATE', 'Incidents', (req) => this.onUpdate(req))
    this.before(['CREATE', 'UPDATE'], 'Incidents', (req) => this.changeUrgencyDueToSubject(req.data))

    const S4 = await cds.connect.to('API_BUSINESS_PARTNER')
    this.on('READ', 'BusinessPartners', (req) => this.readBusinessPartners(req, S4))

    return super.init()
  }

 async readBusinessPartners(req, S4) {
  try {
    return await S4.run(req.query)
  } catch (err) {
    const res = err.reason?.response
    const status = res?.status
    // A stopped app on Cloud Foundry also returns 404, but from the router
    const appDown = res?.headers?.['x-cf-routererror'] === 'unknown_route'

    console.error('[S4] Failed to read business partners:', status, err.message)

    if (status === 404 && !appDown) return req.reject(404, 'Business partner not found.')
    if (status === 401 || status === 403) return req.reject(502, 'Access to S/4HANA was denied.')
    return req.reject(503, 'S/4HANA is currently unavailable.')
  }
}
  changeUrgencyDueToSubject(data) {
    const urgent = data.title?.match(/urgent/i)
    if (urgent) data.urgency_code = 'H'
  }

  /** Custom Validation */
  async onUpdate(req) {
    const closed = await SELECT.one(1).from(req.subject).where`status.code = 'C'`
    if (closed) req.reject`Can't modify a closed incident!`
  }
}

export class AdminService extends cds.ApplicationService {
  init() {
    return super.init()
  }
}