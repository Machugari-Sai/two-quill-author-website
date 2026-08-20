export type HealthResponse = {
  status: 'ok'
  service: 'two-quill-stories-api'
}

export function getHealth(): HealthResponse {
  return {
    status: 'ok',
    service: 'two-quill-stories-api',
  }
}
