import React from 'react';
import { DiaryLetter } from '@/types/diary';
import DiaryNoteHeadline from '@/diary/DiaryNoteHeadline';
import { useNavigate } from 'react-router';
import { sampleQuippers } from '@/logic/utils';

interface DiaryListItemProps {
  letter: DiaryLetter;
  time: bigInt.BigInteger;
}

export default function DiaryListItem({ letter, time }: DiaryListItemProps) {
  const navigate = useNavigate();
  const essay = letter.type === 'outline' ? letter : letter.essay;
  const quippers =
    letter.type === 'outline'
      ? letter.quippers
      : sampleQuippers(letter.seal.quips);
  const quipCount =
    letter.type === 'outline' ? letter.quipCount : letter.seal.quips.size;

  return (
    <div
      className="card cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={() => navigate(`note/${time.toString()}`)}
    >
      <DiaryNoteHeadline
        quippers={quippers}
        quipCount={quipCount}
        essay={essay}
        time={time}
        isInList
      />
    </div>
  );
}
