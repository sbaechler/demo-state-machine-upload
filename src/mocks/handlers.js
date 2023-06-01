// src/mocks/handlers.js
import { rest } from 'msw'

function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout)
    })
}

export const handlers = [
    rest.post('/upload', async (req, res, ctx) => {
        // waits 1 to 5 seconds
        await delay((Math.random() * 4000) + 1000)
        return res(ctx.status(200));
    }),
    rest.get('/*', (req) =>  req.passthrough())
]