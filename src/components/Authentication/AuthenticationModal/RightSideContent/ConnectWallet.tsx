import type { ConnectResult } from '@wagmi/core';
import { multicall } from '@wagmi/core';
import type { AbiError, AbiEvent, AbiFunction, Narrow } from 'abitype';
import React, { useState } from 'react';
import type { UseContractReadConfig } from 'wagmi';
import { useAccount, useConnect, useContractRead } from 'wagmi';

import LifeboatAbi from '../../../../abi/lifeboat.abi.json';

const lifeboatContract: UseContractReadConfig = {
  address: '0x00aFaAa9635c9c40015eC31f3f2bB1B10c766e58',
  abi: LifeboatAbi as Narrow<AbiFunction | AbiEvent | AbiError>[],
};

type ConnectWalletButtonsProps = {
  contentType: number;
  initForwardHandler: Function;
};

const ConnectWalletButtons = ({
  initForwardHandler,
  contentType,
}: ConnectWalletButtonsProps) => {
  const [buttonText, setButtonText] = useState<undefined | string>(undefined);
  const { data: totalLifeboatSupply } = useContractRead({
    ...lifeboatContract,
    watch: true,
    functionName: 'totalSupply',
  });

  const checkUserHasAccessPass = async (
    userAddress: string
  ): Promise<boolean> => {
    const multicalls = [];

    if (
      totalLifeboatSupply?.toString() &&
      +totalLifeboatSupply.toString() > 0
    ) {
      setButtonText('Verifying NFT...');
      for (let i = 1; i < +totalLifeboatSupply!.toString(); i += 1) {
        multicalls.push({
          ...lifeboatContract,
          functionName: 'ownerOf',
          args: [i],
        } as UseContractReadConfig);
      }
      const data = await multicall({
        // @ts-ignore
        contracts: multicalls,
      });
      return data.indexOf(userAddress) > -1;
    }

    return false;
  };

  const determineNextContent = async (userAddress: string) => {
    const hasAccess: boolean = await checkUserHasAccessPass(userAddress);
    setButtonText(hasAccess ? 'NFT Found!' : 'No NFT!');
    const contentIndexToShowNext = hasAccess ? 3 : 2;
    initForwardHandler(contentIndexToShowNext)();
    setButtonText(undefined);
  };

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect({
    async onSuccess(payload: ConnectResult) {
      setButtonText('Connected!');
      determineNextContent(payload.account);
    },
  });

  const onMetaMaskClickHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (!isConnected) {
      setButtonText('Connecting...');
      await connect({ connector: connectors[0] });
    } else {
      await determineNextContent(address as string);
    }
  };

  return (
    contentType === 1 && (
      <>
        {connectors?.[0]?.ready && (
          <button
            disabled={!connectors[0].ready}
            onClick={onMetaMaskClickHandler}
            className="ml-1 mt-0 flex w-4/5 flex-row items-center justify-center rounded-full border bg-white px-4 py-2 text-lg transition disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-700 sm:flex"
          >
            {/* <img
              className="mr-2 h-9 w-9 rounded-full p-1"
              src="./static/media/metamask-fox.d8733638.svg"
              alt="Metamask logo"
            /> */}
            {buttonText || connectors[0].name}
          </button>
        )}
      </>
    )
  );
};

export default ConnectWalletButtons;
