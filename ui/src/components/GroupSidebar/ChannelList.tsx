import cn from 'classnames';
import React, { useCallback } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useIsMobile } from '../../logic/useMedia';
import { channelHref } from '../../logic/utils';
import { useGroup } from '../../state/groups';
import BubbleIcon from '../icons/BubbleIcon';
import useNavStore from '../Nav/useNavStore';
import SidebarLink from '../Sidebar/SidebarLink';
import CaretDownIcon from '../icons/CaretDownIcon';
import ChannelSortOptions from './ChannelSortOptions';
import useSidebarSort from '../../logic/useSidebarSort';

export default function ChannelList({ flag }: { flag: string }) {
  const isMobile = useIsMobile();
  const group = useGroup(flag);
  const { sortFn, sortOptions, setSortFn } = useSidebarSort();
  const hideNav = useNavStore((state) => state.setLocationHidden);
  const hide = useCallback(() => {
    if (isMobile) {
      hideNav();
    }
  }, [hideNav, isMobile]);

  if (!group) {
    return null;
  }

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className="default-focus mt-2 mb-3 rounded-lg p-2 text-gray-600 sm:m-0"
          aria-label="Channels Sort Options"
        >
          <div className="default-focus flex items-center space-x-2 rounded-lg bg-gray-50 p-2 text-base font-semibold">
            <span className="pl-1">{`Channels: ${sortFn}`}</span>
            <CaretDownIcon className="w-4 text-gray-400" />
          </div>
        </DropdownMenu.Trigger>
        <ChannelSortOptions sortOptions={sortOptions} setSortFn={setSortFn} />
      </DropdownMenu.Root>
      <ul className={cn(isMobile && 'space-y-3')}>
        {Object.entries(group.channels).map(([key, channel]) => (
          <SidebarLink
            key={key}
            icon={<BubbleIcon className="h-6 w-6" />}
            to={channelHref(flag, key)}
            onClick={hide}
          >
            {channel.meta.title || key}
          </SidebarLink>
        ))}
      </ul>
    </div>
  );
}
