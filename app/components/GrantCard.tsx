import React, { useContext, useMemo, useCallback } from 'react';
import { Button } from 'antd';
import CountUp from 'react-countup';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import GrantContext from '@/app/lib/GrantContext';
import { ReserveButton } from '@/app/components/ReserveButton';
import { Connect } from "@/app/components/ConnectButton";

interface GrantCardProps {
  selectedGrantId: number;  // 添加一个 prop 来选择当前显示的 grant
  address?: string;
}

const GrantCard: React.FC<GrantCardProps> = ({ selectedGrantId, address }) => {
  const { grants, userReservations } = useContext(GrantContext);

  // Define default grant to prevent undefined errors
  const defaultGrant = {
    grantId: 0,
    amount: '0',
    startTimestamp: 0,
    endTimestamp: 0,
    reservationCount: 0,
    reservedAmount: '0',
    totalReserved: 0,
    status: 'future' as const,
  };

  // Ensure grant is always defined
  const grant = grants?.find((g) => g.grantId === selectedGrantId) || defaultGrant;

  const {
    grantId,
    startTimestamp,
    endTimestamp,
    reservationCount,
    totalReserved,
    status,
    amount,
  } = grant;

  const userReservedAmount = userReservations?.[grantId] || 0;
  const hasReserved = userReservedAmount > 0;

  const isPastGrant = status === "past";
  const isCurrentGrant = status === "current";
  const isFutureGrant = status === "future";

  const countdownDate = useMemo(() => {
    const timestamp = isFutureGrant ? startTimestamp : endTimestamp;
    return new Date(timestamp * 1000);
  }, [isFutureGrant, startTimestamp, endTimestamp]);

  // Memoize the renderer function
  const renderer = useCallback(
    ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
      if (completed) {
        return <span>{isFutureGrant ? 'Started' : 'Ended'}</span>;
      } else {
        return (
          <span>
            {days}d {hours}h {minutes}m {seconds}s
          </span>
        );
      }
    },
    [isFutureGrant]
  );

  // Now, handle the cases where grants or grant are undefined
  if (!grants || grants.length === 0 || !grant || !userReservations) {
    return null;
  }

  const renderActionButton = () => {
    if (!address) {
      // 用户未连接钱包，显示 Sign In 按钮
      return (
        <Connect />
      );
    }

    if (isCurrentGrant) {
      if (hasReserved) {
        return (
          <Button
            type="default"
            size="large"
            style={{
              backgroundColor: '#48bb78',
              borderColor: '#48bb78',
              borderRadius: '8px',
              padding: '0 40px'
            }}
            className="hover:bg-green-500 cursor-not-allowed"
            disabled
          >
            🎉 Successfully reserved {userReservedAmount} UBI
          </Button>
        );
      } else {
        return <ReserveButton />;
      }
    } else if (isPastGrant) {
      return (
        <Button
          type="default"
          size="large"
          style={{
            backgroundColor: userReservedAmount > 0 ? '#48bb78' : '#718096',
            borderColor: userReservedAmount > 0 ? '#48bb78' : '#718096',
            borderRadius: '8px',
            padding: '0 40px',
          }}
          className="cursor-not-allowed"
          disabled
        >
          {userReservedAmount > 0
            ? `🎉 Successfully reserved ${userReservedAmount} UBI`
            : "😔 Sorry, you missed"}
        </Button>
      );
    } else {
      return (
        <Button
          type="default"
          size="large"
          style={{
            backgroundColor: '#718096',
            borderColor: '#718096',
            borderRadius: '8px',
            padding: '0 40px'
          }}
          className="cursor-not-allowed"
          disabled
        >
          Upcoming...
        </Button>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      <h2 className="text-5xl font-extrabold mb-4 text-purple-400 tracking-wide">UBI GRANT ID {grantId}</h2>
      <p className="text-gray-400 mb-8 text-lg">
        {new Date(startTimestamp * 1000).toLocaleString()} - {new Date(endTimestamp * 1000).toLocaleString()}
      </p>

      {(isCurrentGrant || isFutureGrant) && (
        <div className="text-7xl font-extrabold text-red-500 mb-8 drop-shadow-lg shadow-red-500">
          <Countdown date={countdownDate} renderer={renderer} />
        </div>
      )}

      {(isCurrentGrant || isPastGrant) && (
        <div className="flex justify-center space-x-4 mb-8">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-64">
            <h3 className="text-lg font-bold mb-2 text-purple-400">Reserved Addresses</h3>
            <p className="text-3xl font-extrabold">
              <CountUp end={reservationCount} separator="," />
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-64">
            <h3 className="text-lg font-bold mb-2 text-purple-400">Total Reserved UBI</h3>
            <p className="text-3xl font-extrabold">
              <CountUp end={totalReserved} separator="," decimals={0} />
            </p>
          </div>
        </div>
      )}

      {isCurrentGrant && !hasReserved && (
        <p className="text-3xl mb-8 text-gray-300 font-semibold">
          Reservable: <span className="text-green-400">{amount} UBI</span>
        </p>
      )}

      {renderActionButton()}
    </div>
  );
};

export default GrantCard;