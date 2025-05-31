import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia, t } from 'elysia';
import { config } from './config.ts';

const BASE_URL =
  process.env.BASE_URL || 'https://6fe1-125-140-202-46.ngrok-free.app';

export const app = new Elysia()
  .use(swagger())
  .use(cors())
  .get('/', 'Hello World')
  .post(
    '/images/upload-multiple',
    async ({ body }) => {
      try {
        const formData = new FormData();

        // Add each file to FormData
        if (body.files) {
          for (const file of body.files) {
            console.log('File being sent:', {
              name: file.name,
              type: file.type,
              size: file.size,
            });
            formData.append('files', file);
          }
        }

        // Forward the request to the target URL
        const response = await fetch(`${BASE_URL}/images/upload-multiple`, {
          method: 'POST',
          body: formData,
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          return result;
        } else {
          // If not JSON, return the raw response
          const text = await response.text();
          return { data: text };
        }
      } catch (error: any) {
        console.error('Error:', error);
        return {
          error: error?.message || 'An error occurred',
        };
      }
    },
    {
      body: t.Object({
        files: t.Array(t.File()),
      }),
    }
  )
  .post('/auth/signup', async ({ body }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error:', error);
      return {
        error: error?.message || 'An error occurred',
      };
    }
  })
  .post('/auth/login', async ({ body }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error:', error);
      return {
        error: error?.message || 'An error occurred',
      };
    }
  });
