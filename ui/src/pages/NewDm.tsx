import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import ob from 'urbit-ob';
import ChatInput from '@/chat/ChatInput/ChatInput';
import Layout from '@/components/Layout/Layout';
import ShipSelector, { ShipOption } from '@/components/ShipSelector';
import { newUv } from '@/logic/utils';
import { useChatState } from '@/state/chat';
import createClub from '@/state/chat/createClub';
import useSendMultiDm from '@/state/chat/useSendMultiDm';
import { ChatMemo } from '@/types/chat';

export default function NewDM() {
  const [ships, setShips] = useState<ShipOption[]>([]);
  const isMultiDm = ships.length > 1;
  const navigate = useNavigate();
  const shipValues = useMemo(() => ships.map((o) => o.value), [ships]);
  const newClubId = useMemo(() => newUv(), []);
  const sendMultiDm = useSendMultiDm(true, shipValues);

  const validShips = useCallback(
    () =>
      Boolean(shipValues.length) &&
      shipValues.every((ship) => ob.isValidPatp(ship)),
    [shipValues]
  );

  const sendDm = useCallback(
    async (whom: string, memo: ChatMemo) => {
      if (isMultiDm) {
        await sendMultiDm(whom, memo);
      } else {
        await useChatState.getState().sendMessage(whom, memo);
      }

      navigate(`/dm/${whom}`);
    },
    [navigate, sendMultiDm, isMultiDm]
  );

  const onEnter = useCallback(
    async (invites: ShipOption[]) => {
      if (isMultiDm) {
        await createClub(
          newClubId,
          invites.map((s) => s.value)
        );
        navigate(`/dm/${newClubId}`);
      } else {
        navigate(`/dm/${invites[0].value}`);
      }
    },
    [newClubId, isMultiDm, navigate]
  );

  return (
    <Layout
      className="flex-1"
      footer={
        <div className="border-t-2 border-black/10 p-4">
          <ChatInput
            whom={
              ships && ships.length > 0
                ? ships.length > 1
                  ? newClubId
                  : ships[0].value
                : ''
            }
            showReply
            sendDisabled={!validShips()}
            sendMessage={sendDm}
          />
        </div>
      }
    >
      <div className="w-full py-3 px-4">
        <ShipSelector ships={ships} setShips={setShips} onEnter={onEnter} />
      </div>
    </Layout>
  );
}
