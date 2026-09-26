import { dev } from '$app/environment';

// Weak TV browsers: render on the server and ship no JS.
// CSR stays on in dev for hot reload.
export const csr = dev;
