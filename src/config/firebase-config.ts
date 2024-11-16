import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: 'authenticatorapp-44dfa',
  private_key_id: '5aa87b1d40474208404e6eb0865db3b164fb5731',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCurrcdvoj6Ky9o\n/TGVgXSxjDNcf86nFOGMvr2fBVDZcHMGGUisu2DSpOObLUn+KKDrI9m3WE3Zd/02\nyuoH9yEoOIZNJOss/5VpANdSAHOre4GYcbJt2os74WFq3VsNnecVPnXhD7f7fNiy\nZVCa+I7a0I0vi1qmF7w6flooRheS83D4C75IT67RXcFWQr9JI81QjDc+0XQJiYn8\n423hUpehuMDvCYQybJY0MhLXI+R6kq/BUIJ0ScCMB5C3kF9HRSRKtFfdGEXe120/\nmuikukQ0V6zJ22Bc2xYCxdck99BlRiuhNdrPBLFEj3Xh7O5lyQBy2aiyl12toWJP\nG0xT7in1AgMBAAECggEABbkQR/inCWiXSqa66z6vMpN9jki2Xfnlw2QT8vGZ9lCW\nfdjWkc1Mw81dXAcqkT40KEyQ2Q6R4hQp9wqNeINDqSZ/gDEEs0pQd7O+vr9WHRaY\n9DsCOAladOupRRIgQV78hBpEcMIlCmevcxEQ46korCBXhhZ8utUZKsdImPMc7Br8\nKyP9FU4euAbQiTSHxs+AufDTYHJwHV7TWoXqfkUCRJ52oC8w+3GiCJxNlTcL/B3y\nBM0O0SC7BRrE1PctZSYABl9db+1RaK1tjRMJf4HnWICmeQSIu6i1dxx0u9fl58YT\nwoEIPCzuaFMGPu8SxaNvK6xEdyG9nGeiy3mVYRpoAQKBgQD0YRCxxMSaB6kEh1l2\na3odsxGn3K8s7AHnPKXV3oyyQDjPyL4eEuHqBlYn1H8ipW66gbz/y2Jqw0bIlpMP\nF6PBHLOFIkFngiq0UVmqWrVTIXzls/5a4yrbeL3wgfIROeBwoz7/PJQyj4AIbbWI\nkxfm+QjnKna7nuljhjXRYsaB9QKBgQC2/TOqQSIlsmWS8X0W8/N8LrzNK/Lm6BrT\nAqdbh83KYIOazQEg4qx5BqFohOzpAXbOiqKgM9S692bIhthVnEqbAeSFKU0dCPkn\n38VJUAflumhWMD4Cw+/5+NFgOF0khBgNXtReDreSYSxDrnkwMf3inxYnG0nPlyCA\nlEMj4bgIAQKBgQDMXkxOziY4RgWz8tj/LnyOT82JGwYoRCqHTfHFvHrfKtQX+GH9\n1n61bp0obA3yVHUYZh0/sb/ZVvtgDoRnT7azbaQ3x2D5BiNebtXUoE0Ze1zu4Crr\nqSSTLBN0Ccf9XfBzYiHx46Bv9A/3fIAe+hw4HbWzVJC88PVvNLLXK4qk7QKBgDVN\nWAlV4657Yp8E/Nz8voYDzzcsgBrGrVmdwkYlLsquhmdHI/cCUB8I0WdyoNfWd1b+\nhxSHRIYZnrT2onl9hzXTvU8UksPMY1c8FWmfiE1gmRfSAZ4omPSFh+exQ2Bpod/z\nKYUkYFChQZWNcvuY9E1Y7ckCZ+OyL+OETHJdQ5ABAoGBAM6Hzhjz5uDl/QJvY4Wo\n23samY5JDOEPIAAkfgo8KBd5eQTnLwkg4HYjRfY3A1UontUOkZZaodEbgm27KSTh\nYaQMcjBcKvAmUNCElCNP6JKOotcSnh33FHzZAObhDMkiKiCTWgtnH3MBf1n3efmO\nxpB8Hhsyz07sAUtAwJbuwVPR\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-q7ajd@authenticatorapp-44dfa.iam.gserviceaccount.com',
  client_id: '106516651127831670555',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q7ajd%40authenticatorapp-44dfa.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default admin;
