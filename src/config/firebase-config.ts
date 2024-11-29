import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: 'cigarhclub',
  private_key_id: '77d1d07bba67d2ee19bf19efabd73d6244ea9410',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDsUJ20OIA0Rt8S\nDqOlqdMtGc6yVD/GO/jF1QWUqnFkQ3Fm+zcSJvprukcboaa1HKtpWlkNaPU1gqbv\n6X0o1/ekRhXozATz2wk/F1engCM5elQtUxxPyZe8nuVg2Nh2NWk9c+MQBaiEFhTM\nwKwPqhF150k+wi4oU3FvcF0gKISAvvxpERZwWWAB5ki2vN+QZeu9yC5VgcprId50\nfTNqK9+asUFuXWTARlH5kfo7JxNBdI+9K7g9DtzmJvGgMjclu7CEdKBKGElnJV7l\n1TwwPABe5l4esDWLtX1UAd1L9086NMszbMwwalkoORs0ExoWBu221DjbudglGCZO\nDSZgfqnlAgMBAAECggEAJo5hqK+mRUFB8JOIYkVi0eM5zPE/hYOv63E965tijFIP\nrNZ0jgbjiVOXefvmM/sVQYdu66fyCBTE0XR2SgVwn3Ia7YRqE3JroApaMBdRR/W8\nSbfbcO4qjmkbcjF3IdRFkzP2+lx9+e0TYDPYbubX2fWORwnOF6DDq4O5Af/yXIHc\na2DN8sjRHiDbKbLNz3SzPgI+ijyHA94aUDV9VFVWXoaPGbfwU7xTyUtcUatOKPzu\ngWwtLCVFpwf/DZGmrjSrMfYten6ryPWKXKWZtdyOmg6cmK1fb/x0hL4oJgT0NzPH\nhCQRTob+Ed7WJ1JB67H7Gk+5SoGTlIgOvFoNrUSfmQKBgQD7lFkEakyLujTESVZB\nBV0PNjqrzEX5B16f/LvDjOf5VO3WOfJBIgnGp3QsG9xMhykl3ikpetEfv++bLGYe\n1Z48Mh6qvuXOMZJGy1lOoqbRqJ3iyW4DhGQADesMNyg8SFm/gh5CEYubPMkLsM+w\noZ5tYoZpe8wPlH2OK0KXBAn2rQKBgQDwd5r3vWGmcICUeQmF0sTZ2uMnP20w78N0\nhSfT4k0IyArhiOUeqHY3+kcW6NcbcxKSGi1L/ww9Hv6HUj6QqHl/6wsdFbyg9jrL\n3o89ef4C0ZI/aaIsiZMKe1MiQzYBMcR5wmYkHaFDjVyt7fj3VsJSjuehpyt4+Aom\nKi6nDjU/GQKBgGTiy4O6wPFzfX+NTTqL1RKpk4ObSiAgNXEA36b+lXPl++5hlGVM\nKhFwy2R407IYrYaS/Xy11LDfvk1C07zfuzG2g5fDL9KtDFS5bRncnfsLnCz6y9Q7\nPgLLkgt2/vqVpO/oVQv3jz10dcbrY44Ycbi5vt8EFwPUbzkY3f5DT1+NAoGBAOqb\nhrIWLuN397rjrArIbA4wpFZyZ1HLWuKf1w++RnI+2X7ZVNDogw5yPFF5sgSx7Hhm\n2bK/j21ChAn6j9gKxx+qbhleT76q/QpShWXxU4Xkec8sfHD/eFpNn/pZoKLhr1Mr\n+wNZdTC3Bqka+EA4gTaS/iKVOrC3Lw+1L/cEwaZhAoGAPxeVlfYP9At0aS24dUFD\n5jckeQLHpmnBeuC1J1SkDMEoKidelG/x4WCSLBi7e0MdrNitWwEo5wRHvAFQP21Y\nE9rdE4hYbE8NCBFE/ByqkTuueu1YBZBds74I/F57q1g4LWOBVvTom7XjdC4f7YN6\nH1OQPA6h5ZlNDwRTRCV9JCs=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-fq2bc@cigarhclub.iam.gserviceaccount.com',
  client_id: '109821367648004227943',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fq2bc%40cigarhclub.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const storage = admin.storage();
export default admin;
