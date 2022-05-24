import React, { useCallback, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import ChatInput from '../chat/ChatInput/ChatInput';
import Layout from '../components/layout/Layout';
import { useChatState, useDmIsPending, useDmMessages } from '../state/chat';
import ChatWindow from '../chat/ChatWindow';

export default function Dm() {
  const ship = useParams<{ ship: string }>().ship || '';
  const isAccepted = !useDmIsPending(ship);
  const canStart = useChatState(
    useCallback((s) => ship && Object.keys(s.briefs).includes(ship), [ship])
  );

  useEffect(() => {
    if (ship && canStart) {
      useChatState.getState().initializeDm(ship);
    }
  }, [ship, canStart]);
  const messages = useDmMessages(ship);
  const navigate = useNavigate();
  const onAccept = () => {
    useChatState.getState().dmRsvp(ship, true);
  };
  const onDecline = () => {
    navigate(-1);
    useChatState.getState().dmRsvp(ship, false);
  };

  return (
    <Layout
      className="h-full grow"
      header={
        <h1 className="flex h-full items-center border-b-2 border-gray-50 p-4 text-lg font-bold">
          {ship}
        </h1>
      }
      aside={<Outlet />}
      footer={
        isAccepted ? (
          <div className="border-t-2 border-gray-50 p-4">
            <ChatInput whom={ship} />
          </div>
        ) : null
      }
    >
      {isAccepted ? (
        <ChatWindow whom={ship} messages={messages} />
      ) : (
        <div className="flex flex-col">
          <div className="flex">
            <button onClick={onDecline} type="button">
              Decline
            </button>
            <button onClick={onAccept} type="button">
              Accept
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
