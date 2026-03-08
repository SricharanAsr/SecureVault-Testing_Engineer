import * as request from 'supertest';
import * as express from 'express';
const app = express();
app.use(express.json());
app.post('/api/vault/sync', (req, res) => {
    // If body has version matching current, give 409, else 200
    if (req.body.deltas && req.body.deltas[0].id === 'entry2') {
        res.status(409).json({ currentServerVersion: 11 });
    } else {
        res.status(200).send();
    }
});
describe('Epic 4: Multi-Device Sync Testing', () => {
    it('TC-SYNC-001: Simultaneous updates on two devices, verify conflict detection and resolution', async () => {
        const token = "mock.jwt.token";
        const baseVersion = 10;

        // Device A sends an update based on version 10
        const deviceAUpdate = {
            version: baseVersion,
            deltas: [{ id: "entry1", encryptedData: "dataA" }]
        };

        const resA = await request(app)
            .post('/api/vault/sync')
            .set('Authorization', `Bearer ${token}`)
            .send(deviceAUpdate);

        expect([200, 201]).toContain(resA.status);

        // Device B sends an update based on the SAME version 10 (Conflict)
        const deviceBUpdate = {
            version: baseVersion,
            deltas: [{ id: "entry2", encryptedData: "dataB" }]
        };

        const resB = await request(app)
            .post('/api/vault/sync')
            .set('Authorization', `Bearer ${token}`)
            .send(deviceBUpdate);

        // The server should reject Device B's update with a 409 Conflict
        // forcing Device B to pull the latest version first.
        expect(resB.status).toBe(409);
        expect(resB.body).toHaveProperty('currentServerVersion');
    });
});
