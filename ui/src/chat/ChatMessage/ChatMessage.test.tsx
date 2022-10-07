import fetch from 'cross-fetch';
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import { unixToDa } from '@urbit/api';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { setupServer } from 'msw/node';
import ChatMessage from './ChatMessage';
import { makeFakeChatWrit } from '../../mocks/chat';

vi.stubGlobal('fetch', (url: string, init: any) =>
  fetch(`http://localhost:3000${url}`, init)
);

// declare which API requests to mock
const server = setupServer(
  // capture "GET /greeting" requests
  rest.get('/~/scry/chat/draft/*', (req, res, ctx) =>
    // respond using a mocked JSON body
    res(
      ctx.json({
        whom: '~zod/test',
        story: {
          inline: ['test'],
          block: [],
        },
      })
    )
  )
);

// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

describe('ChatMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it('renders as expected', () => {
    const date = new Date(2021, 1, 1, 13);
    const writ = makeFakeChatWrit(
      1,
      '~finned-palmer',
      {
        block: [],
        inline: [{ bold: ['A bold test message'] }, 'with some more text'],
      },
      undefined
    );
    const da = unixToDa(date.valueOf());
    const { asFragment } = render(
      <MemoryRouter>
        <TooltipProvider>
          <ChatMessage
            time={da}
            whom="~zod/test"
            writ={writ}
            newAuthor
            newDay
          />
        </TooltipProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
