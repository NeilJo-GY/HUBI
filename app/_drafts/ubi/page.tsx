// app/ubi/page.tsx
import dynamic from 'next/dynamic';
import moment from 'moment';

const DynamicMixedChart = dynamic(() => import('@/app/_drafts/ui/ubi/mixedchart'), { ssr: false });
const DynamicUbiAllowanceCard = dynamic(() => import('@/app/_drafts/ui/ubi/allowancecard'), { ssr: false });
const DynamicClaimAllowance = dynamic(() => import('@/app/_drafts/ui/ubi/claimallowance'), { ssr: false });

const exampleData = {
  period: 1,
  startDate: '2024-06-25',
  endDate: '2024-07-01',
  claimedAddresses: 150,
  totalAddresses: 200,
  claimedUbi: 2250,
  recentTransactions: [
    { address: '0xABC123', ubi: 15, time: moment().subtract(1, 'hours') },
    { address: '0xDEF456', ubi: 15, time: moment().subtract(2, 'hours') },
    { address: '0xABC123', ubi: 15, time: moment().subtract(3, 'hours') },
    { address: '0xDEF456', ubi: 15, time: moment().subtract(4, 'hours') },
    { address: '0xABC123', ubi: 15, time: moment().subtract(5, 'hours') },
    { address: '0xDEF456', ubi: 15, time: moment().subtract(1, 'day') },
  ],
};

const UbiPage: React.FC = () => {
  return (
    <div>
      <div >
        <div >
          <div className="text-3xl font-bold">Universal Basic Income (UBI)</div>
          <div >
            2.15 UBI / day
            UBI Price: $1
          </div>
        </div>
        <div style={{ padding: '0', margin: '0' }}>
          <DynamicMixedChart />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ padding: '0', margin: '0' }}>
          <DynamicUbiAllowanceCard {...exampleData} />
        </div>
        <div style={{ padding: '0', margin: '0' }}>
          <DynamicClaimAllowance />
        </div>
      </div>
    </div>
  );
};

export default UbiPage;